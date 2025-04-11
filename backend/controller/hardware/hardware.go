package hardware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/hardware-project/config"
	"github.com/Tawunchai/hardware-project/entity"
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