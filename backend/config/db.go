package config

import (
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/Tawunchai/hardware-project/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("hospital.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// ปัดเศษเป็นทศนิยม 2 ตำแหน่ง เช่น 3.1415 -> 3.14
func randomFloat(min, max float64) float64 {
	raw := min + rand.Float64()*(max-min)
	return math.Round(raw*100) / 100
}

func SetupDatabase() {
	// AutoMigrate ตาราง
	db.AutoMigrate(&entity.HardwareData{})

	// สร้างข้อมูลย้อนหลัง
	startDate := time.Date(2025, 4, 1, 0, 0, 0, 0, time.Local)
	endDate := time.Date(2025, 5, 30, 0, 0, 0, 0, time.Local)

	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		morning := time.Date(d.Year(), d.Month(), d.Day(), 9, 0, 0, 0, time.Local)

		// สร้างข้อมูล hardware พร้อมปัดทศนิยม 2 ตำแหน่ง
		dataMorning := entity.HardwareData{
			Formaldehyde: randomFloat(1.0, 5.0),
			Tempreture:   randomFloat(24.0, 50.0),
			Humidity:     randomFloat(30.0, 100.0),
			Date:         morning,
		}

		db.FirstOrCreate(&dataMorning, &entity.HardwareData{Date: morning})
	}
}
