import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import GetDogs from './api/GetDogs';
import styled from 'styled-components'

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const dogBreeds = GetDogs();
  const [subBreeds, setSubBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [selectedSubBreed, setSelectedSubBreed] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const numbers = 50;
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [dogImages, setDogImages] = useState([]);

  //once the GetDogs request is complete
  useEffect(() => {
    if (dogBreeds != undefined){
      setLoading(false);
    }
  }, [dogBreeds])

  //when you select a breed, update the sub-breeds
  useEffect(() => {
    if (selectedBreed != undefined){
      console.log(selectedBreed);
      setSelectedSubBreed("");
      fetch("https://dog.ceo/api/breed/"+selectedBreed+"/list")
      .then(response => response.json())
      .then(data => setSubBreeds(data.message));
    }
  }, [selectedBreed])

  useEffect(() => {
    console.log(dogImages);
  }, [dogImages])
  

  //if this breed has sub-breeds then display the dropdown
  function HasSubBreeds(){
    if (subBreeds == undefined)
      return false;
    if (subBreeds.length > 0)
      return true;
    else
      return false;
  }

  async function ViewImages(){
    console.log("getting images of dogs")
    let invalid = [];
    let valid = true;
    console.log(selectedBreed);
    if (selectedBreed == null || selectedBreed == undefined){
      invalid.push("breed");
      valid = false;
    }
    if (HasSubBreeds()){
      console.log(selectedSubBreed);
      if (selectedSubBreed == null || selectedSubBreed == undefined || selectedSubBreed == ""){
        invalid.push("sub-breed");
        valid = false;
      }
    }
    if (valid){
      console.log("get dog images success");
      if (HasSubBreeds()){
        console.log("getting sub breed images");
        fetch("https://dog.ceo/api/breed/"+selectedBreed+"/"+selectedSubBreed+"/images/random/"+selectedNumber)
        .then(response => response.json())
        .then(data => setDogImages(data.message));
      }else{
        console.log("getting breed dog images");
        fetch("https://dog.ceo/api/breed/"+selectedBreed+"/images/random/"+selectedNumber)
        .then(response => response.json())
        .then(data => setDogImages(data.message));
      }
      
    }else{
      console.log("get dog images failed");
    }
    setInvalidInputs(invalid);
  }

  function CheckValid(checkme){
    if (invalidInputs.includes(checkme)){
      return false;
    }else
      return true;
  }
  
  
  if (isLoading){
    return <div>
      Loading...
    </div>
  }
  else{
  return (

    <main style={{margin: "20px"}}
    >


      <DropdownContainer>
        <label for="breed">Breed: </label>
        <Dropdown valid={CheckValid("breed")} id="breed"onChange={(e) => setSelectedBreed(e.target.value)}>
        <option disabled selected value=""> -- select a breed -- </option>
        {Object.keys(dogBreeds).map((breed) => {
          return(
          <option>{breed}</option>
          )
        })}
      </Dropdown>
      </DropdownContainer>

      {HasSubBreeds()  &&
      <DropdownContainer>
        <label for="sub-breed">Sub-Breed: </label>
        <Dropdown valid={CheckValid("sub-breed")} id="sub-breed" onChange={(e) => setSelectedSubBreed(e.target.value)}>
        <option disabled selected value=""> -- select a sub-breed -- </option>
        {subBreeds.map((sub) => {
          return(
          <option>{sub}</option>
          )
        })}
        </Dropdown>
      </DropdownContainer>
      }

      <DropdownContainer>
        <label for="numberofimages">Number of images:</label>
        <Dropdown style={{width: "200px"}}valid={CheckValid("numberofimages")} id="numberofimages" onChange={(e) => setSelectedNumber(e.target.value)}>
        {[...Array(numbers)].map((e, i) => {
          return(
          <option>{i+1}</option>
          )
        })}
        </Dropdown>
      </DropdownContainer>

<DropdownContainer>
<label ></label>
  <Button onClick={ViewImages}>
    View images
  </Button>
</DropdownContainer>
<br/>
{dogImages != undefined &&

dogImages.map((dogimage) => {
  return(
    <DogImg src={dogimage}></DogImg>
  )
})
}
      



    </main>
  )
  }
}


const DogGrid = styled.div`

`

const DogImg = styled.img`
width: 200px;
height: 200px;
display: inline-block;
margin: 20px;
object-fit: cover;

`

const Button = styled.button`
  display: inline-block;
  color: black;
  font-size: 1em;
  margin: 1.3em;
  padding: 0.25em 2em;
  border-radius: 2px;
  background: rgb(255,255,255);
  background: linear-gradient(90deg, rgba(50,255,255,1) 0%, rgba(50,250,107,1) 50%, rgba(50,255,255,1) 100%);
  display: block;
`;

const DropdownContainer = styled.div`
  display: inline-grid;
  margin-right: 20px;
`

const Dropdown = styled.select`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: black;
  border: 2px solid ${props => props.valid ? "white" : "red"};
  background: white;
`;
