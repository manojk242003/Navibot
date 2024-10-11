import Menu from "./Shops"
import Navbar from "./Navbar"
import { useEffect } from "react"
import { Location } from "../atoms/Location"
import { useRecoilState } from "recoil"
const Home = () => {
  const [loc,setLoc] = useRecoilState(Location)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      // setLoc(position.coords.latitude);
      // setLongitude(position.coords.longitude);
      setLoc({lat:position.coords.latitude,lon:position.coords.longitude})
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    })
  },[])
  return (
    <div className="bg-white h-screen">
        <Navbar />
        <Menu />
    </div>
  )
}

export default Home