
import React, {useState} from 'react';
import './App.css';

import 
{GoogleMap,
withScriptjs,
withGoogleMap,
Marker,
InfoWindow,
} from 'react-google-maps';

import PlaceAutocomplete ,{
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';

import useFetch from './useFetch';
import Card from './components/Card';
import micIcon from './images/mic_icon.png';
import searchBar from './images/search_bar.png';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Preloader from './components/Preloader';


function App() {


 
  
  
  
  const [comparisonday,setComparisonday]= useState("");
  const [selectedMic, setSelectedMic] = useState(null);
  const [address,setAddress]=useState("");
  const [userCoordinates,setUserCoordinates]=useState({lat:"null",lng:"null"});
  var result1=0;
  var result2=0;

  const {data, loading, error}=useFetch(`${process.env.REACT_APP_BACKEND}`);
  if(loading) 
  return <Preloader/>;
  if(error) console.log(error);
  

  function Map(){ //function map
    
      return(
        <GoogleMap
            defaultZoom={12}
            defaultCenter={{lat:28.59120859050926, lng:77.19249522689171}}
            
         >

         {data.map( micItem =>{
          var destination=new window.google.maps.LatLng(micItem.latitude,micItem.longitude);
          var service = new window.google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
  {
    origins: [userCoordinates],
    destinations: [destination],
    travelMode: 'DRIVING',
    unitSystem: window.google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: true,
  }, callback);

  function callback(response,status){
     if (status !== "OK") {
          console.log("Error with distance matrix");
          return;
        }
      result1=response.rows[0].elements[0].duration.text;
      result2=response.rows[0].elements[0].distance.text;
      micItem["TravelTime"]="Travel Time from location: "+result1;
      micItem["Distance"]="Distance from location: "+result2;

  }

         })
         
         }
  
    
         {data.map( micItem =>(
          
          
        (micItem.day.indexOf(`${comparisonday}`) !==-1) &&  
          
        <Marker
          key={micItem.id}
          position={{
            lat:micItem.latitude,
            lng:micItem.longitude
          }}
          onClick={ () => {
            setSelectedMic(micItem);
          }}
          icon={{
            url: micIcon,
            scaledSize:new window.google.maps.Size(30,30)
            }}
        />
    
        ))}


        

        

        
    

     {selectedMic !=null && (

                      
          <InfoWindow
          
          position={{
            lat:selectedMic.latitude,
            lng:selectedMic.longitude
          }}
          onCloseClick ={()=> {
            setSelectedMic(null);
          }}
          >

          
          
          <div className="mic_card_container">
          <Card 
            key={selectedMic.id}
            name={selectedMic.name}
            image={selectedMic.image.formats.small.url}
            time={selectedMic.time}
            price={selectedMic.price}
            type={selectedMic.type}
            duration={selectedMic.duration}
            instagram={selectedMic.instagram}
            whatsapp={selectedMic.whatsapp}
            TravelTime={selectedMic.TravelTime}
            Distance={selectedMic.Distance}
            location={selectedMic.location}
            
    
    
          />
          </div>
    
          </InfoWindow>
          
          
        )}
     
     
         </GoogleMap>
      );
    }

    function handleSearch(){
      const title= document.getElementById('day').value;
      setComparisonday(title);
      
    }
    const handleSelect=async (value)=>{
      const results= await geocodeByAddress(value);
      const latlng=await getLatLng(results[0]);
      setAddress(value);
      setUserCoordinates(latlng);


    }
    

    const WrappedMap = withScriptjs(withGoogleMap(Map));
    console.log(`apikey is  ${process.env.REACT_APP_MAPS_API}`);


  return (
    <div className="h-screen">

      <Header />

      <AboutUs />
      
      <div className=" sm:flex flex-row  justify-center gap-4 mt-10  ">
      <PlaceAutocomplete value={address} onChange={setAddress} onSelect={handleSelect} >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading })=> 
        <div>
        <input {...getInputProps({placeholder:"Enter your address"})} 
        className="h-11 w-96 border-solid border-gray-400 border-2 p-2 "/>

        <div>
          {loading? <div>....Loading</div>:null}
          {suggestions.map((suggestion)=>{
            const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };

            return <div {...getSuggestionItemProps(suggestion, {style})}>{suggestion.description}</div>
          })}


        </div>
        </div>
      }
     
      </PlaceAutocomplete>
      <div>
      <input
          
          type="text"
          placeholder="Enter the day on which you want to perform"
          id="day"
          autoComplete="off"
          className=" w-96 h-11 border-solid border-gray-400 border-2 p-2 m-auto "
          
          
        />
        <button onClick={handleSearch} >
          <img src={searchBar} className="searchButton h-7 w-7 relative " />
        </button>
      </div>
      </div>

      

      
      

     

      <div className=" relative h-full  w-5/6 mx-auto mt-10 mb-16 border-solid border-gray-900 border-2 rounded-3xl overflow-hidden">
      <WrappedMap 
      
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key= ${process.env.REACT_APP_MAPS_API}`}
      loadingElement={<div style={{height: '100%'}} />}
      containerElement={<div style={{height: '100%'}} />}
      mapElement={<div style={{height: '100%'}} />}

      
    
      />
      

      </div>
    
      
    </div>
  );
  
}


export default App;