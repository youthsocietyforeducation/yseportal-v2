import React from 'react';
import renderer from 'react-test-renderer';
import { NewButton } from '../NewButton';

test('Link changes the class when hovered', () => {
	const component = renderer.create(<NewButton>Facebook</NewButton>);
	let tree = component.toJSON();
	console.log(tree);
	expect(tree).toMatchSnapshot();

	// // manually trigger the callback
	// tree.props.onMouseEnter();
	// // re-rendering
	// tree = component.toJSON();
	// expect(tree).toMatchSnapshot();

	// // manually trigger the callback
	// tree.props.onMouseLeave();
	// // re-rendering
	// tree = component.toJSON();
	// expect(tree).toMatchSnapshot();
});
