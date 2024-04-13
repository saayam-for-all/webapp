import React from "react";
import "./HowWeOperate.css";
import howWeOperateData from "./data";

const HowWeOperate = () => {
	return (
		<div className='px-14 my-6'>
			{howWeOperateData?.map((item, idx) => (
				<div key={idx}>
					<h1 className='text-2xl font-semibold mt-3'>
						{item?.heading}
					</h1>
					{item?.points.map((point, index) => (
						<div key={index}>
							{!Array.isArray(point) ? (
								<ul className='list-disc text-lg pl-10'>
									<li>{point}</li>
								</ul>
							) : (
								point.map((subPoint, subIndex) => (
									<div key={subIndex}>
										{!Array.isArray(subPoint) ? (
											<ul
												style={{
													listStyleType: "circle",
												}}
												className='pl-20 text-lg'
											>
												<li>{subPoint}</li>
											</ul>
										) : (
											subPoint.map(
												(subSubPoint, subSubIndex) => (
													<ul
														key={subSubIndex}
														style={{
															listStyleType:
																"square",
														}}
														className='pl-28 text-lg'
													>
														<li>{subSubPoint}</li>
													</ul>
												)
											)
										)}
									</div>
								))
							)}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

// recursive function to render nested list
// const HowWeOperate = () => {
// 	const renderList = (points, level) => {
// 		return (
// 			<ul
// 				className={`text-lg pl-8`}
// 				style={{
// 					listStyleType:
// 						level === 0
// 							? "disc"
// 							: level === 1
// 							? "circle"
// 							: "square",
// 				}}
// 			>
// 				{points.map((point, index) => (
// 					<li key={index}>
// 						{!Array.isArray(point)
// 							? point
// 							: renderList(point, level + 1)}
// 					</li>
// 				))}
// 			</ul>
// 		);
// 	};

// 	return (
// 		<div className='px-14 my-6'>
// 			{howWeOperateData?.map((item, idx) => (
// 				<div key={idx}>
// 					<h1 className='text-2xl font-semibold mt-3'>
// 						{item?.heading}
// 					</h1>
// 					{renderList(item.points, 0)}
// 				</div>
// 			))}
// 		</div>
// 	);
// };

export default HowWeOperate;
