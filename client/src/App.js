import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
	// const [facts, setFacts] = useState([]);
	const [facts, setFacts] = useState({});
	const [listening, setListening] = useState(false);

	useEffect(() => {
		if (!listening) {
			const events = new EventSource('http://localhost:4000/events');

			// Subscribe to event with type 'test'
			events.addEventListener('test', function (event) {
				console.log('event.data', event.data);
			});

			// Subscribe to all events without an explicit type
			events.onmessage = event => {
				const parsedData = JSON.parse(event.data);

				console.log(parsedData, 'parsedData');

				// setFacts(facts => facts.concat(parsedData));
				setFacts(facts => ({...facts, parsedData}));
			};

			setListening(true);
		}
	}, [listening, facts]);

	return (
		<table className='stats-table'>
			<thead>
				<tr>
					<th>Fact</th>
					<th>Source</th>
				</tr>
			</thead>
			<tbody>
				{/* {facts.map((fact, i) => (
					<tr key={i}>
						<td>{fact.info}</td>
						<td>{fact.source}</td>
					</tr>
				))} */}
			</tbody>
		</table>
	);
}

export default App;
