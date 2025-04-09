package entity

import (
	"time"
	"gorm.io/gorm"
)


type DataHardware struct {
   gorm.Model
   Date time.Time
   Data float64 
}