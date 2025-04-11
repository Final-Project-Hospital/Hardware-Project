package config

import (
	"fmt"
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
	return min + rand.Float64()*(max-min)
}


func SetupDatabase() {

	db.AutoMigrate(

		&entity.HardwareData{},
	)

   startDate := time.Date(2025, 4, 1, 0, 0, 0, 0, time.Local)
   endDate := time.Date(2025, 5, 30, 0, 0, 0, 0, time.Local)
   
   for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
	   morning := time.Date(d.Year(), d.Month(), d.Day(), 9, 0, 0, 0, time.Local)
	   dataMorning := entity.HardwareData{
		   Formaldehyde: randomFloat(2.0, 5.0),
		   Tempreture:   randomFloat(24.0, 30.0),
		   Humidity:     randomFloat(60.0, 75.0),
		   Date:         morning,
	   }
	   db.FirstOrCreate(&dataMorning, &entity.HardwareData{Date: morning})
   }

}
