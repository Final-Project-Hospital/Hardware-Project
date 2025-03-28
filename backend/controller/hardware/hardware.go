package hardware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/hardware-project/config"
	"github.com/Tawunchai/hardware-project/entity"
)

func ListDataHardware(c *gin.Context) {
	var dataHardware []entity.DataHardware

	db := config.DB()
	result := db.Find(&dataHardware)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, dataHardware)
}