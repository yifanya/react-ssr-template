import * as React from 'react';
import ReactDOM from 'react-dom';

interface IHello {
	content: string
}

const Hello = (props: IHello) => {
	return (
		<div>
			{ props.content }
		</div>
	);
};

ReactDOM.render(<Hello content={'Hello World'} />, document.getElementById('root'));
