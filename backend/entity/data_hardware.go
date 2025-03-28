package entity


import "gorm.io/gorm"


type DataHardware struct {
   gorm.Model
   Data float64 
}