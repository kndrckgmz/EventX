import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react';
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns'
import { firebaseAuth, firestore } from '@/firebaseconfig';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const meetings = [
    {
        id: 1,
        name: 'Leslie Alexander',
        startDatetime: '2024-08-13T13:00',
        endDatetime: '2024-08-13T14:30',
    },
    {
        id: 2,
        name: 'Leslie Alexander',
        startDatetime: '2024-08-13T14:00',
        endDatetime: '2024-08-13T16:30',
    },
    {
        id: 3,
        name: 'Leslie Alexander',
        startDatetime: '2024-08-13T07:00',
        endDatetime: '2024-08-13T08:30',
    },
    {
        id: 4,
        name: 'Leslie Alexander',
        startDatetime: '2024-08-21T07:00',
        endDatetime: '2024-08-21T08:30',
    }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const Calender = () => {

    let today = startOfToday()

    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    const [events, setEvents] = useState([])
    const [selectedDayEvents, setSelectedDayEvents] = useState([])

    useEffect(() => {
        const get_all_events = async () => {
            const querySnapshot = await getDocs(collection(firestore, "event"));
            let temparray = []
            querySnapshot.forEach((doc) => {
                let ex = doc.data()
                ex.id = doc.id
                temparray.push(ex)
                setEvents(temparray);
                // setEvents([...events, ex]);
            });
        }
        get_all_events();
    }, [])

    useEffect(() => {
        let filteredevents = events.filter((event) => {
            let date = (event) => {
                console.log(event)
                const milliseconds = event.startDatetime.seconds * 1000;
                const dateObject = new Date(milliseconds);
                const isoString = dateObject.toISOString();
                const formattedIsoString = parseISO(isoString.slice(0, 16));
                return (formattedIsoString)
            }

            if (isSameDay(date(event), selectedDay)) {
                return event
            }
        })
        setSelectedDayEvents(filteredevents)
    }, [events, selectedDay])

    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    let selectedDayMeetings = meetings.filter((meeting) => {
        isSameDay(parseISO(meeting.startDatetime), selectedDay)
    }
    )

    return (
        <div className="pt-4 pb-4">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14">
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-100">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-3 rounded-3xl bg-white text-neutral-700 hover:text-neutral-900"
                            >
                                <span className="sr-only">Previous month</span>
                                <Icon icon="heroicons-outline:chevron-left" />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-3 rounded-3xl bg-white text-neutral-700 hover:text-neutral-900"
                            >
                                <span className="sr-only">Next month</span>
                                <Icon icon="heroicons:chevron-right" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-300">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-1.5'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={classNames(
                                            isEqual(day, selectedDay) && 'text-white',
                                            !isEqual(day, selectedDay) &&
                                            isToday(day) &&
                                            'text-red-500',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                            isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                            isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            'bg-gray-700',
                                            !isEqual(day, selectedDay) && 'hover:bg-gray-500',
                                            (isEqual(day, selectedDay) || isToday(day)) &&
                                            'font-semibold',
                                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                        )}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </button>

                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {events.some((event) => {
                                            let date = (event) => {
                                                const milliseconds = event.startDatetime.seconds * 1000;
                                                const dateObject = new Date(milliseconds);
                                                const isoString = dateObject.toISOString();
                                                const formattedIsoString = parseISO(isoString.slice(0, 16));
                                                return (formattedIsoString)
                                            }
                                            return isSameDay(date(event), day)
                                        })
                                            &&

                                            (<div className="w-1 h-1 rounded-full bg-sky-500"></div>)
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-14">
                        <h2 className="font-semibold text-gray-50">
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            {/* {selectedDayMeetings.length > 0 ? (
                                selectedDayMeetings.map((meeting) => (
                                    <Meeting meeting={meeting} key={meeting.id} />
                                ))
                            ) : (
                                <p>No events</p>
                            )} */}
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map((event) => (
                                    <Event event={event} key={event.id} />
                                ))
                            ) : (
                                <p>No events</p>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    )
}

function Meeting({ meeting }) {
    let startDateTime = parseISO(meeting.startDatetime)
    let endDateTime = parseISO(meeting.endDatetime)

    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl bg-neutral-800 text-white focus-within:bg-white hover:bg-neutral-700">
            <div
                className="flex-none bg-neutral-600 w-10 h-10 rounded-full"
            />
            <div className="flex-auto">
                <p>{meeting.name}</p>
                <p className="mt-0.5">
                    <time dateTime={meeting.startDatetime}>
                        {format(startDateTime, 'h:mm a')}
                    </time>{' '}
                    -{' '}
                    <time dateTime={meeting.endDatetime}>
                        {format(endDateTime, 'h:mm a')}
                    </time>
                </p>
            </div>
            <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-800 hover:text-gray-900">
                        <span className="sr-only">Open options</span>
                        <Icon icon="iconamoon:menu-kebab-vertical" />
                        {/* <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" /> */}
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Cancel
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
    )
}

function Event({ event }) {

    let format1 = (event) => {
        const milliseconds = event.startDatetime.seconds * 1000;
        const dateObject = new Date(milliseconds);
        const isoString = dateObject.toISOString();
        const formattedIsoString = isoString.slice(0, 16);
        return (formattedIsoString)
    }
    let startDateTime = (event) => {
        const milliseconds = event.startDatetime.seconds * 1000;
        const dateObject = new Date(milliseconds);
        const isoString = dateObject.toISOString();
        const formattedIsoString = parseISO(isoString.slice(0, 16));
        return (formattedIsoString)
    }
    let format2 = (event) => {
        const milliseconds = event.endDatetime.seconds * 1000;
        const dateObject = new Date(milliseconds);
        const isoString = dateObject.toISOString();
        const formattedIsoString = isoString.slice(0, 16);
        return formattedIsoString
    }
    let endDateTime = (event) => {
        const milliseconds = event.endDatetime.seconds * 1000;
        const dateObject = new Date(milliseconds);
        const isoString = dateObject.toISOString();
        const formattedIsoString = parseISO(isoString.slice(0, 16));
        return (formattedIsoString)
    }

    return (
        <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl bg-neutral-800 text-white focus-within:bg-white hover:bg-neutral-700 cursor-pointer hover:scale-[1.03] transition-all duration-300">
            <div
                className="flex-none bg-neutral-600 w-10 h-10 rounded-full"
            />
            <div className="flex-auto">
                <strong><p>
                    {
                        event.Artist.join(', ')
                    }
                </p></strong>
                <div>{event.Venue} - ${event.Payment}</div>
                <p className="mt-0.5">
                    <time dateTime={format1(event)}>
                        {format(startDateTime(event), 'h:mm a')}
                    </time>{' '}
                    -{' '}
                    <time dateTime={format2(event)}>
                        {format(endDateTime(event), 'h:mm a')}
                    </time>
                </p>
            </div>
            <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-800 hover:text-gray-900">
                        <span className="sr-only">Open options</span>
                        <Icon icon="iconamoon:menu-kebab-vertical" />
                        {/* <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" /> */}
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Cancel
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
    )
}

let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]

export default Calender