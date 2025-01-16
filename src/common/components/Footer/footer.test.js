import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import Footer from "./Footer.jsx"
import React from "react"

test("contains copyright info", () => {
    render(<Footer />)
    const copyrightMessage = "Copyright © 2024 Saayam. All Rights Reserved"
    expect(screen.getByText(copyrightMessage)).toBeInTheDocument()
})