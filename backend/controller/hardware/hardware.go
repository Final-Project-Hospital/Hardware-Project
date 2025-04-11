package hardware

import (
	"net/http"
	"strconv"
	"time"

	"github.com/Tawunchai/hardware-project/config"
	"github.com/Tawunchai/hardware-project/entity"
	"github.com/gin-gonic/gin"
)

func ListDataHardware(c *gin.Context) {
	var dataHardware []entity.HardwareData

	db := config.DB()
	result := db.Find(&dataHardware)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, dataHardware)
}

func CreateDataHardware(c *gin.Context) {
	var dataHardware entity.HardwareData

	if err := c.ShouldBindJSON(&dataHardware); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	if err := db.Create(&dataHardware).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกข้อมูลได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "สร้างข้อมูลสำเร็จ",
		"data":    dataHardware,
	})
}

func FindDataHardwareByDate(c *gin.Context) {
	dateQuery := c.Query("date") 

	date, err := time.Parse("2006-01-02", dateQuery)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันที่ไม่ถูกต้อง ควรใช้ YYYY-MM-DD"})
		return
	}

	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, time.Local)
	endOfDay := startOfDay.AddDate(0, 0, 1)

	db := config.DB()
	var dataHardware []entity.HardwareData

	result := db.Where("date >= ? AND date < ?", startOfDay, endOfDay).Find(&dataHardware)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, dataHardware)
}

func FindDataHardwareByMonth(c *gin.Context) {
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, err1 := strconv.Atoi(monthStr)
	year, err2 := strconv.Atoi(yearStr)

	if err1 != nil || err2 != nil || month < 1 || month > 12 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุเดือน (1-12) และปีให้ถูกต้อง เช่น ?month=4&year=2025"})
		return
	}

	startOfMonth := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)
	endOfMonth := startOfMonth.AddDate(0, 1, 0)

	db := config.DB()
	var dataHardware []entity.HardwareData

	result := db.Where("date >= ? AND date < ?", startOfMonth, endOfMonth).Find(&dataHardware)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, dataHardware)
}

func FindDataHardwareByYear(c *gin.Context) {
	yearStr := c.Query("year")

	year, err := strconv.Atoi(yearStr)
	if err != nil || year < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุปีให้ถูกต้อง เช่น ?year=2025"})
		return
	}

	startOfYear := time.Date(year, time.January, 1, 0, 0, 0, 0, time.Local)
	endOfYear := startOfYear.AddDate(1, 0, 0)

	db := config.DB()
	var dataHardware []entity.HardwareData

	result := db.Where("date >= ? AND date < ?", startOfYear, endOfYear).Find(&dataHardware)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, dataHardware)
}