jest.mock('i18next-browser-languagedetector', () => ({
    type: 'languageDetector',
    init: () => {},
  }));

jest.mock('i18next');
jest.mock('i18next-browser-languagedetector');


import InactivityLogoutTimer from "./InactivityTimer";
import {render,screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {Provider} from 'react-redux'
import { MemoryRouter } from "react-router";

import { store } from "#redux/store";
import { axe,toHaveNoViolations } from "jest-axe";



  

// mock

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
    useStore: jest.fn(() => ({
      getState: jest.fn(),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
    })),
    Provider: ({ children }) => children, // for manual wrap
  }));
  
  
  jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  }));

describe('tests logic of component', () =>{
    test('checks updateExpiryTime', () =>{

        render(
        <Provider store = {store}>
            <MemoryRouter>
            <InactivityLogoutTimer>
            <div data-testid = 'divChild'> hello world </div>
        </InactivityLogoutTimer>
        </MemoryRouter>
        </Provider>

        )

        const divChild = screen.getByTestId('divChild')
        expect(divChild).toBeInTheDocument()

    })
    test('checks checkForInactivity', () =>{
        
    })
    test('accesibility test',async () =>{
      expect.extend(toHaveNoViolations)
      const {container} = render( <Provider store = {store}>
        <MemoryRouter>
        <InactivityLogoutTimer>
        <div data-testid = 'divChild'> hello world </div>
    </InactivityLogoutTimer>
    </MemoryRouter>
    </Provider>)

    expect(await axe(container)).toHaveNoViolations
    })
})