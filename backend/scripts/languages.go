package main

import (
	"github.com/KrisjanisP/deikstra/service/config"
	"github.com/KrisjanisP/deikstra/service/database"
	"github.com/KrisjanisP/deikstra/service/models"
)

func main() {
	conf := config.LoadAppConfig()
	db, err := database.ConnectAndMigrate(conf.DBConnString)
	if err != nil {
		panic(err)
	}
	var languages []models.Language
	languages = append(languages, models.Language{ID: "C", Name: "C"})
	languages = append(languages, models.Language{ID: "C++17", Name: "C++17 (GNU G++)"})
	languages = append(languages, models.Language{ID: "Python3.10", Name: "Python3.10"})

	tx := db.Begin()
	for _, lang := range languages {
		err = tx.FirstOrCreate(&lang, models.Language{Name: lang.Name}).Error
		if err != nil {
			tx.Rollback()
			panic(err)
		}
	}
	tx.Commit()
}
