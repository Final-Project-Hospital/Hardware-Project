package config

import (
	"fmt"
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

func SetupDatabase() {

	db.AutoMigrate(

		&entity.HardwareData{},
	)

   // HardwareData

	date1 := time.Date(2025, 4, 11, 9, 0, 0, 0, time.Local)
	date2 := time.Date(2025, 4, 11, 15, 30, 0, 0, time.Local)

	HardwareData1 := entity.HardwareData{Formaldehyde: 4.52,Tempreture: 24.56,Humidity: 70.00, Date: date1}

   HardwareData2 := entity.HardwareData{Formaldehyde: 2.75,Tempreture: 32.56,Humidity: 65.23, Date: date2}

	db.FirstOrCreate(&HardwareData1, &entity.HardwareData{Formaldehyde: 4.52,Tempreture: 24.56,Humidity: 70.00, Date: date1})
	db.FirstOrCreate(&HardwareData2, &entity.HardwareData{Formaldehyde: 2.75,Tempreture: 32.56,Humidity: 65.23, Date: date2})

}
