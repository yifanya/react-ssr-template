import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import * as m from './index.m.less';

interface IHello {
	content: string
}

const Hello = (props: IHello) => {
	return (
		<div className={m.lalala}>
			{ props.content }
		</div>
	);
};

ReactDOM.render(<Hello content={'Hello World'} />, document.getElementById('root'));
