package entity

import (
	"time"
	"gorm.io/gorm"
)


type HardwareData struct {
   gorm.Model
   Date time.Time
   Formaldehyde  float64 
   Tempreture float64
   Humidity float64
}