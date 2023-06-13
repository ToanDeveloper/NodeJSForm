import db, { sequelize } from '../models/index'
const { QueryTypes } = require('sequelize');
const { Op, Sequelize } = require("sequelize");


// Insert many records
let insertMenus = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let menus = await db.Menu.bulkCreate([
                {
                    menuID: "MN08",
                    menuName: "Khách Hàng",
                    iconMenu: `<FaHome className="icon"/>`,
                    typeMenu: "Cha",
                }
            ])
            resolve(menus)
        } catch (error) {
            reject(error)
        }
    })
}

// Insert One
let postAPICustomer = (customer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let insertCustomer = await db.Customer.create({
                customerID: customer.customerID,
                email: customer.email,
                password: customer.password,
                fullName: customer.fullName,
                gender: customer.gender,
                birthday: customer.birthday + "",
                phoneNumber: customer.phoneNumber,
                passport: customer.passport,
            }, { validate: true , raw : true})
            resolve({
                insert : true
            })
        } catch (error) {
            // reject(error)
            let messageError = error.errors.map((ValidationErrorItem) => {
                return {path : ValidationErrorItem.path,
                    message : ValidationErrorItem.message,
                }
            })
            let arrayPathError = [...new Set(messageError.map((e) => {
                return e.path
            }))]
            let arrayError = arrayPathError.map((path)=>{
                let errors = messageError.filter((error) => {
                    return error.path === path
                })
                return errors
            })
            resolve({
                insert : false,
                arrayPathError : arrayPathError,
                arrayError : arrayError
            });
        }
    })
}

// FindOne
let getAPIComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let comment = await db.Comment.findOne({ where: { commentID: id } }, { raw: true })
            resolve(comment)
        } catch (error) {
            reject(error)
        }
    })
}

// FindAll
let getAPIListMenusParents = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let menus = await db.Menu.findAll({ where: { typeMenu: "Cha" } }, { raw: true })
            if (menus) {
                resolve(menus)
            }
        } catch (error) {
            reject(error)
        }
    })
}

// RawQuery
let getTopPlaceTravel = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let topTravel = await sequelize.query(
                `SELECT Tickets.placeTravelID, PlaceTravels.touristName,
                    SUM(Tickets.numberChild + Tickets.numberAdult) as 'totalTicket', 
                    SUM(Fares.fareAdult*Tickets.numberAdult) + SUM(Fares.fareChild*Tickets.numberChild) as 'revenue'
                    FROM Fares INNER JOIN PlaceTravels ON Fares.placeTravelID = PlaceTravels.placeTravelID 
                    INNER JOIN Tickets ON Fares.placeTravelID = Tickets.placeTravelID
                    where MONTH(Tickets.orderDate) = MONTH(GETDATE())
                    group by Tickets.placeTravelID, PlaceTravels.touristName
                    order by totalTicket DESC
                    OFFSET 0 ROWS
                    FETCH NEXT 10 ROWS ONLY`
                , {
                    type: QueryTypes.SELECT
                }
            )
            resolve(topTravel);
        } catch (error) {
            reject(error)
        }
    })
}

let getRevenueInYear = async() => {
    let listTravel = await getAPIListIDPlaceTravel()
    listTravel = listTravel.map((travel) => {
        return (travel.dataValues.placeTravelID);
    })
    return new Promise((resolve, reject) => {
        try {
            let datas = []
            let querys = listTravel.forEach(async(travel, index) => {
                let data = await sequelize.query(
                        `
                        SELECT Tickets.placeTravelID, PlaceTravels.touristName,
                        SUM(Tickets.numberChild + Tickets.numberAdult) as 'totalTicket', 
                        SUM(Fares.fareAdult*Tickets.numberAdult) + SUM(Fares.fareChild*Tickets.numberChild) as 'revenue',
                        MONTH(Tickets.orderDate) as 'month', YEAR(Tickets.orderDate) as 'year'
                        FROM Fares INNER JOIN PlaceTravels ON Fares.placeTravelID = PlaceTravels.placeTravelID 
                        INNER JOIN Tickets ON Fares.placeTravelID = Tickets.placeTravelID
                        where Tickets.placeTravelID = ? AND YEAR(Tickets.orderDate) = YEAR(GETDATE())
                        group by Tickets.placeTravelID, PlaceTravels.touristName, MONTH(Tickets.orderDate), YEAR(Tickets.orderDate)
                        order by 'month' ASC
                        `
                    ,{
                        type: QueryTypes.SELECT,
                        replacements: [travel],
                })
                datas.push([...data])
                if(index + 1 === listTravel.length){
                    resolve(datas);
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

// Put API
let putAPIPlaceTravel = (placeTravel) => {
    return new Promise(async (resolve, reject) => {
        try {
            let updatePLaceTravel = await db.PlaceTravel.update({
                placeTravelID: placeTravel.idTravel,
                touristName: placeTravel.nameTravel,
                pointOfDeparture: placeTravel.pointOfDeparture,
                destination: placeTravel.destination,
                vehicle: placeTravel.vehicle,
                typeOfTourism: placeTravel.typeOfTourism,
                avatarTourist: placeTravel.avatarTourist,
            }, { where: { placeTravelID: placeTravel.idTravel } })
            resolve(true)
        } catch (error) {
            resolve(false)
            reject(error)
        }
    })
}

//Delete API
let deleteAPIPlaceTravel = (placeTravelID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deletePlaceTravel = await db.PlaceTravel.destroy({ where: { placeTravelID: placeTravelID } })
            resolve(true)
        } catch (error) {
            resolve(false)
            reject(error)
        }
    })
}

module.exports = {
    insertMenus,

    // Get
    getAPIListMenusParents,
    getAPIComment,
    getTopPlaceTravel,
    getRevenueInYear,
    // Post
    postAPICustomer,

    //Put
    putAPIPlaceTravel,

    // Delete
    deleteAPIPlaceTravel,
}