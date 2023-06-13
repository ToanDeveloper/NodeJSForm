import homeService from '../services/homeService'

// Get API
let getAPIListMenus = async(req, res) => {
    let menus = await homeService.getAPIListMenus()
    return res.status(200).json({
        message : "Danh sách menus",
        menus : menus
    })
}

// Post API
let postAPIPlaceTravel = async(req, res) => {
    let insertPlaceTravel = await homeService.postAPIPlaceTravel(req.body)
    if(insertPlaceTravel){
        return res.status(200).json({
            message : "Thêm Địa Điểm Du Lịch",
            insert : true
        })
    }
    else{
        return res.status(200).json({
            message : "Thêm Địa Điểm Du Lịch",
            insert : false
        })
    }
}

// Put API
let putAPIPlaceTravel = async(req, res) => {
    let updatePlaceTravel = await homeService.putAPIPlaceTravel(req.body)
    if(updatePlaceTravel){
        return res.status(200).json({
            message : `Cập Nhật Địa Điểm Du Lịch ${req.body.idTravel}`,
            update : true
        })
    }
    else{
        return res.status(200).json({
            message : `Cập Nhật Địa Điểm Du Lịch ${req.body.idTravel}`,
            update : false
        })
    }
}

// Delete API
let deleteAPIPlaceTravel = async(req, res) => {
    let deletePlaceTravel = await homeService.deleteAPIPlaceTravel(req.body.placeTravelID)
    if(deletePlaceTravel){
        return res.status(200).json({
            message : `Xóa Địa Điểm Du Lịch ${req.body.placeTravelID}`,
            delete : true
        })
    }
    else{
        return res.status(200).json({
            message : `Xóa Địa Điểm Du Lịch ${req.body.placeTravelID}`,
            delete : false
        })
    }

}

module.exports = {
    //Get
    getAPIListMenus,

    //Post
    postAPIPlaceTravel,

    //Put
    putAPIPlaceTravel,

    //Delete
    deleteAPIPlaceTravel,
    
}