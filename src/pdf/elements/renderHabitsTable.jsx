import { View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { getWeekendDays } from '~/lib/date';
import { dayPageLink } from '~/pdf/lib/links';

class HabitsTable extends React.Component {
	constructor( props ) {
		super( props );
		const habitColumnWidth = 40;
		const habitSquareWidth = props.config.alwaysOnSidebar ? 12 : 13;
		const stylesObject = {
			habitsTable: {
				flexGrow: 0,
				flexDirection: 'column',
				fontSize: 8,
			},
			habitsHeader: {
				flexDirection: 'row',
				alignItems: 'center',
			},
			habitsTitle: {
				fontWeight: 'normal',
			},
			habitDay: {
				fontSize: 8,
				flexDirection: 'column',
				borderRight: '1 solid #AAA',
				borderBottom: '1 solid #AAA',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				textDecoration: 'none',
				color: 'black',
				width: habitSquareWidth,
				minWidth: habitSquareWidth,
				height: habitSquareWidth,
			},
			habitDayDate: {
				fontWeight: 'bold',
				position: 'relative',
				top: -1,
			},
			habitDayOfWeek: {
				fontSize: 6,
				textAlign: 'center',
				position: 'relative',
				top: -1,
			},
			habitRow: {
				flexDirection: 'row',
			},
			habitContainer: {
				justifyContent: 'center',
				alignItems: 'center',
				height: habitSquareWidth,
				borderRight: '1 solid #AAA',
				borderBottom: '1 solid #AAA',
				width: habitColumnWidth,
				fontWeight: 'bold',
			},
			habitSquare: {
				height: habitSquareWidth,
				width: habitSquareWidth,
				minWidth: habitSquareWidth,
				borderRight: '1 solid #AAA',
				borderBottom: '1 solid #AAA',
				textDecoration: 'none',
			},
			weekendDay: {
				backgroundColor: '#EEE',
			},
		};
		this.styles = StyleSheet.create( stylesObject );
	}

	renderHabitsTable() {
		let habits;
		if ( this.props.range === 'week' ) {
			habits = this.props.config.weeklyHabits;
		} else {
			habits = this.props.config.monthlyHabits;
		}
		if ( habits.length === 0 ) {
			return null;
		}
		return (
			<View style={ this.styles.habitsTable }>
				{this.renderHabitsHeader()}
				{habits.map( this.renderHabit )}
			</View>
		);
	}

	renderHabitsHeader() {
		const { date, t, range } = this.props;
		let currentDate;
		let endDate;

		if ( range === 'week' ) {
			currentDate = date.startOf( 'week' );
			endDate = date.endOf( 'week' );
		} else {
			currentDate = date.startOf( 'month' );
			endDate = date.endOf( 'month' );
		}

		const days = [];
		while ( currentDate.isBefore( endDate ) || currentDate.isSame( endDate, 'day' ) ) {
			days.push( this.renderDay( currentDate ) );
			currentDate = currentDate.add( 1, 'day' );
		}
		return (
			<View style={ this.styles.habitsHeader }>
				<View style={ this.styles.habitContainer }>
					<Text style={ this.styles.habitsTitle }>{t( 'page.month.habits.title' )}</Text>
				</View>
				{days}
			</View>
		);
	}

	renderDay( day ) {
		return (
			<Link
				key={ day.unix() }
				src={ '#' + dayPageLink( day, this.props.config ) }
				style={ this.styles.habitDay }
			>
				<Text style={ this.styles.habitDayDate }>{day.format( 'D' )}</Text>
				<Text style={ this.styles.habitDayOfWeek }>{day.format( 'dd' )}</Text>
			</Link>
		);
	}

	renderHabit = ( { id, value } ) => {
		return (
			<View key={ id } style={ this.styles.habitRow }>
				<View style={ this.styles.habitContainer }>
					<Text>{value}</Text>
				</View>
				{this.renderHabitSquares()}
			</View>
		);
	};

	renderHabitSquares() {
		const { config, range } = this.props;
		const weekendDays = getWeekendDays( config.weekendDays, config.firstDayOfWeek );
		let currentDate;
		let endDate;

		if ( range === 'week' ) {
			currentDate = this.props.date.startOf( 'week' );
			endDate = this.props.date.endOf( 'week' );
		} else {
			currentDate = this.props.date.startOf( 'month' );
			endDate = this.props.date.endOf( 'month' );
		}

		const squares = [];
		while ( currentDate.isBefore( endDate ) || currentDate.isSame( endDate, 'day' ) ) {
			const styles = [ this.styles.habitSquare ];
			if ( weekendDays.includes( currentDate.day() ) ) {
				styles.push( this.styles.weekendDay );
			}
			squares.push(
				<Link
					key={ currentDate.date() }
					style={ styles }
					src={ '#' + dayPageLink( currentDate, config ) }
				/>,
			);
			currentDate = currentDate.add( 1, 'day' );
		}
		return squares;
	}

	render() {
		return this.renderHabitsTable();
	}
}

HabitsTable.propTypes = {
	date: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	t: PropTypes.func.isRequired,
	range: PropTypes.oneOf( [ 'month', 'week' ] ).isRequired,
};

export default HabitsTable;
