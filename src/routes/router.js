import express from "express"
import homeController from '../controllers/homeController'

let router = express.Router();

let initWebRoutes = (app) => {
    
    router.get("/", homeController.getHomePage);

    // Get API
    router.get("/api/menu/get-list-menu", homeController.getAPIListMenus)

    // Post API
    router.post("/api/place-travel/insert-place-travel", homeController.postAPIPlaceTravel)

    // Put API
    router.put("/api/place-travel/update-place-travel", homeController.putAPIPlaceTravel)


    // Delete API
    router.post("/api/place-travel/delete-place-travel", homeController.deleteAPIPlaceTravel)

    return app.use("/", router);
}

export default initWebRoutes