import React from "react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "../../../src/redux/store";
import { requestApi } from "../../../src/services/requestApi";
import { thunk } from "redux-thunk";

import "@testing-library/jest-dom";
import { configure, render, screen, waitFor } from "@testing-library/react";
import HelpRequestForm from "../../../src/pages/HelpRequest/HelpRequestForm";
import { configureStore } from "@reduxjs/toolkit";
import configureMockStore from 'redux-mock-store'
import { test } from "vitest";

//LAYOUT

test("it renders and checks divs with mt-3 class, the parent divs", async () => {
  const middlewares = [thunk, requestApi.middleware]; 
  const configureMock = configureMockStore(middlewares)
  const initialState =  {
    request: {
    categories: [], 
  },
  auth: {
    idToken: 'mockToken', // Esto depende de lo que use tu componente
  },
    is_self: "yes",
    requester_first_name: "",
    requester_last_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Select",
    preferred_language: "",
    category: "General",
    request_type: "remote",
    location: "",
    subject: "",
    description: "",
  }
  const storeMock = configureMock(initialState)
  /*
  STORE STRUCTURE STORE STRUCTURE

    const initialState = {
    is_self: "yes",
    requester_first_name: "",
    requester_last_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Select",
    preferred_language: "",
    category: "General",
    request_type: "remote",
    location: "",
    subject: "",
    description: "",
}*/


    

      render(
        <MemoryRouter>
          <Provider store={storeMock}>
            <HelpRequestForm/>
          </Provider>
        </MemoryRouter>
      )

      await waitFor(() => {
        const loadingMessage = screen.queryByText(/Loading.../);
        expect(loadingMessage).not.toBeInTheDocument();
      }, { timeout: 10000 });

  // Ahora puedes hacer las verificaciones sobre los elementos
  const firstParentDiv = screen.getByTestId("parentDivOne");
  const secondParentDiv = screen.getByTestId("parentDivTwo");
  const thirdParentDiv = screen.getByTestId("parentDivThree");
  const fourthParentDiv = screen.getByTestId("parentDivFour");

  // Verifica que los divs se estén renderizando
  expect(firstParentDiv).toBeInTheDocument();
  expect(secondParentDiv).toBeInTheDocument();
  expect(thirdParentDiv).toBeInTheDocument();
  expect(fourthParentDiv).toBeInTheDocument();
})
      
  
//LOGIC


test('checks handleForSelfFlag constant', () => {

})

test('CHECKS handleSubcategoryClick ', ()=>{})

test('checks handleSubcategoryClick', ()=>{})

test('checks handleCategoryClick', ()=>{})

test('checks handleClickOutside', ()=>{})

test('handleSearchInput', ()=>{})

test('CHECKS fetchLanguages', ()=>{})

test('checks handleSubmit', ()=>{})

test('checks closeForm', ()=>{})

test('handleChange', ()=>{})