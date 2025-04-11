package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/hardware-project/config"
	"github.com/Tawunchai/hardware-project/controller/hardware"
	"github.com/Tawunchai/hardware-project/middlewares"
)

const PORT = "8000"

func main() {

	config.ConnectionDB()

	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	authorized := r.Group("")
	authorized.Use(middlewares.Authorizes())
	{
		// ยังไม่ได้ใช่ช่อง Athentication นะ
	}

	public := r.Group("")
	{
		public.GET("/data-hardware", hardware.ListDataHardware)
		public.POST("/create-data-hardware",hardware.CreateDataHardware)
		public.GET("/hardware/by-date", hardware.FindDataHardwareByDate)
		public.GET("/hardware/by-month", hardware.FindDataHardwareByMonth)
		public.GET("/hardware/by-year", hardware.FindDataHardwareByYear)

	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
