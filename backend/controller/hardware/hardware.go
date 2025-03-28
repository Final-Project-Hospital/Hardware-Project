package hardware

package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team18/config"
	"github.com/sut67/team18/entity"
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