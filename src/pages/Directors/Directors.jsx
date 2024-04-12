import "./Directors.css";
// import ''

export default function Directors() {
	return (
		<div className='container bod_container '>
			<center>
				<h1 className='bod_heading'>Board of Directors</h1>
			</center>

			<div className='row'>
				<div className='col-sm-3'>
					<div className='card person-card person_1'>
						<center>
							<div className='card-body'>
								<img
									className='person_image'
									src='images/Rao.jpeg'
									alt='Rao'
								/>
								<h5 className='card-title person_name'>
									Rao K Bhethanabotla
								</h5>
							</div>

							<div className='person-details'>
								<p>
									<strong>Name:</strong> Rao K Bhethanabotla
								</p>
								<p>
									<strong>Founder/President/CEO/CTO</strong>{" "}
								</p>
								<p className='Director_LinkedIn'>
									<strong>LinkedIn:</strong>{" "}
									<a href='https://www.linkedin.com/in/raobhethanabotla'>
										Rao K Bhethanabotla
									</a>
								</p>
							</div>
						</center>
					</div>
				</div>
				<div className='col-sm-3'>
					<div className='card person-card person_2'>
						<center>
							<div className='card-body'>
								<img
									className='person_image'
									src='images/Ramesh_Maturu.jpeg'
									alt='Ramesh Maturu'
								/>
								<h5 className='card-title person_name'>
									Ramesh Maturu
								</h5>
							</div>

							<div className='person-details'>
								<p>
									<strong>Name:</strong> Ramesh Maturu
								</p>
								<p>
									<strong>Director</strong>{" "}
								</p>
								<p className='Director_LinkedIn'>
									<strong>LinkedIn:</strong>{" "}
									<a href='https://www.linkedin.com/in/rameshmaturu/'>
										Ramesh Maturu
									</a>
								</p>
							</div>
						</center>
					</div>

					<div class='row'>
						<div class='col-sm-3'>
							<div className='card person-card person_3'>
								<center>
									<div className='card-body'>
										<img
											className='person_image'
											src='images/Rao-Panuganti.jpeg'
											alt='Rao-Panuganti'
										/>
										<h5 className='card-title person_name'>
											Rao Panuganti
										</h5>
									</div>

									<div className='person-details'>
										<p>
											<strong>Name:</strong> Rao-Panuganti
										</p>
										<p>
											<strong>
												Director & Secretary
											</strong>{" "}
										</p>
										<p className='Director_LinkedIn'>
											<strong>LinkedIn:</strong>{" "}
											<a href='https://www.linkedin.com/in/rao-panuganti-654443/'>
												Rao-Panuganti
											</a>
										</p>
									</div>
								</center>
							</div>
						</div>
						<div class='col-sm-3'>
							<div className='card person-card person_4'>
								<center>
									{/* <div className="card-body">

                                        <img className="C" src="images/Naveen_Sharma.jpeg" alt="Naveen_Sharma" />
                                        <h5 className="card-title person_name">Naveen Sharma</h5>
                                    </div>

                                    <div className="person-details">
                                        <p><strong>Name:</strong> Naveen Sharma</p>
                                        <p><strong>Director </strong> </p>
                                        <p className='Director_LinkedIn'><strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/nsharma2/'>Naveen Sharma</a></p>
                                    </div> */}
									<div className='card-body'>
										<img
											className='person_image'
											src='images/Naveen_Sharma.jpeg'
											alt='Naveen_Sharma'
										/>
										<h5 className='card-title person_name'>
											Naveen Sharma
										</h5>
									</div>

									<div className='person-details'>
										<p>
											<strong>Name:</strong> Naveen Sharma
										</p>
										<p>
											<strong>Director </strong>{" "}
										</p>
										<p className='Director_LinkedIn'>
											<strong>LinkedIn:</strong>{" "}
											<a href='https://www.linkedin.com/in/nsharma2/'>
												Naveen Sharma
											</a>
										</p>
									</div>
								</center>
							</div>
						</div>
						<div class='col-sm-3'>
							<div className='card person-card 5'>
								<center>
									<div className='card-body'>
										<img
											className='person_image'
											src='images/Rajeshwary.jpeg'
											alt='NRajeshwary Jaldu'
										/>
										<h5 className='card-title person_name'>
											Rajeshwary Jaldu
										</h5>
									</div>

									<div className='person-details'>
										<p>
											<strong>Name:</strong> Rajeshwary
											Jaldu
										</p>
										<p>
											<strong>
												Director & Treasurer
											</strong>{" "}
										</p>
										<p className='Director_LinkedIn'>
											<strong>LinkedIn:</strong>{" "}
											<a href='https://www.linkedin.com/in/rajeshwary-jaldu/'>
												Rajeshwary Jaldu
											</a>
										</p>
									</div>
								</center>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
