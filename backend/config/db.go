package config


import (

   "fmt"

   "github.com/Tawunchai/hospital-project/entity"

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

       &entity.DataHardware{},

   )
   DataHardware1 := entity.DataHardware{Data: 12.54}

   DataHardware2 := entity.DataHardware{Data: 15.89}


   db.FirstOrCreate(&DataHardware1, &entity.DataHardware{Data: 12.54})

   db.FirstOrCreate(&DataHardware2, &entity.DataHardware{Data: 15.89})


}