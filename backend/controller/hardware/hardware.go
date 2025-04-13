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

func FindDataHardwareByDateRange(c *gin.Context) {
	startStr := c.Query("start") // ?start=2025-04-01
	endStr := c.Query("end")     // ?end=2025-04-10

	// ตรวจสอบว่าใส่ครบทั้ง start และ end
	if startStr == "" || endStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุ start และ end ในรูปแบบ YYYY-MM-DD เช่น ?start=2025-04-01&end=2025-04-10"})
		return
	}

	// แปลง string เป็น time.Time
	startDate, err1 := time.Parse("2006-01-02", startStr)
	endDate, err2 := time.Parse("2006-01-02", endStr)

	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบวันที่ไม่ถูกต้อง ควรใช้ YYYY-MM-DD"})
		return
	}

	endDate = endDate.AddDate(0, 0, 1)

	db := config.DB()
	var dataHardware []entity.HardwareData

	result := db.Where("date >= ? AND date < ?", startDate, endDate).Find(&dataHardware)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, dataHardware)
}

func FindDataHardwareByWeekday(c *gin.Context) {
	weekdayQuery := c.Query("weekday") // เช่น ?weekday=Monday

	// แปลง string เป็น time.Weekday
	var targetDay time.Weekday
	switch weekdayQuery {
	case "Sunday":
		targetDay = time.Sunday
	case "Monday":
		targetDay = time.Monday
	case "Tuesday":
		targetDay = time.Tuesday
	case "Wednesday":
		targetDay = time.Wednesday
	case "Thursday":
		targetDay = time.Thursday
	case "Friday":
		targetDay = time.Friday
	case "Saturday":
		targetDay = time.Saturday
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณาระบุชื่อวันให้ถูกต้อง เช่น ?weekday=Monday"})
		return
	}

	// ดึงข้อมูลทั้งหมดจากฐานข้อมูล (หรือตามช่วงเวลาได้ถ้าอยากจำกัด)
	db := config.DB()
	var allData []entity.HardwareData
	if err := db.Find(&allData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลทั้งหมดได้"})
		return
	}

	// filter ตามวันในสัปดาห์
	var filteredData []entity.HardwareData
	for _, data := range allData {
		if data.Date.Weekday() == targetDay {
			filteredData = append(filteredData, data)
		}
	}

	if len(filteredData) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "ไม่พบข้อมูลในวัน " + weekdayQuery})
		return
	}

	c.JSON(http.StatusOK, filteredData)
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