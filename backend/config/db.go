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

func randomFloat(min, max float64) float64 {
	raw := min + rand.Float64()*(max-min)
	return math.Round(raw*100) / 100
}

func daysInMonth(year int, month time.Month) int {
	return time.Date(year, month+1, 0, 0, 0, 0, 0, time.Local).Day()
}

func SetupDatabase() {
	db.AutoMigrate(&entity.HardwareData{})

	for year := 2024; year <= 2025; year++ {
		for month := 1; month <= 12; month++ {
			for day := 1; day <= 28; day++ {
				if day <= daysInMonth(year, time.Month(month)) {
					morning := time.Date(year, time.Month(month), day, 9, 0, 0, 0, time.Local)

					data := entity.HardwareData{
						Formaldehyde: randomFloat(1.0, 5.0),
						Tempreture:   randomFloat(24.0, 50.0),
						Humidity:     randomFloat(30.0, 100.0),
						Date:         morning,
					}

					db.FirstOrCreate(&data, &entity.HardwareData{Date: morning})
				}
			}
		}
	}
}
