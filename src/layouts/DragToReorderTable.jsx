import React from 'react';
import InputPlayers from "../pages/tournaments/stageComponents/InputPlayers";

const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
};

const DragToReorderTable = (props) => {
    const {selectedMembers, setSelectedMembers, members, setMembers, selected, selectMember, setCompetitors, players, setPlayers} = props;
    

    // const [list, setList] = React.useState(selectedMembers);
    const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);

    const onDragStart = (event) => {
        const initialPosition = Number(event.currentTarget.dataset.position);
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: initialPosition,
            isDragging: true,
            originalOrder: selectedMembers
        });
        event.dataTransfer.setData("text/html", '');
    };
    const onDragOver = (event) => {
        event.preventDefault();
        let newList = dragAndDrop.originalOrder;

        // index of the item being dragged
        const draggedFrom = dragAndDrop.draggedFrom;

        // index of the droppable area being hovered
        const draggedTo = Number(event.currentTarget.dataset.position);

        const itemDragged = newList[draggedFrom];
        const remainingItems = newList.filter((item, index) => index !== draggedFrom);

        newList = [
            ...remainingItems.slice(0, draggedTo),
            itemDragged,
            ...remainingItems.slice(draggedTo)
        ];

        if (draggedTo !== dragAndDrop.draggedTo) {
            setDragAndDrop({
                ...dragAndDrop,
                updatedOrder: newList,
                draggedTo: draggedTo
            })
        }
    };

    const onDrop = (event) => {
        event.preventDefault();
        setSelectedMembers(dragAndDrop.updatedOrder);
        const competitors = [];
        for (const obj of dragAndDrop.updatedOrder) {
            competitors.push(obj.id || obj.user_id);
        }
        setCompetitors(competitors);
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false
        });
    };

    const onDragLeave = () => {
        setDragAndDrop({
            ...dragAndDrop,
            draggedTo: null
        });
    };

    const onDeletePlayer = (e, index) => {
        e.preventDefault();
        const arr = selectedMembers;
        const memList = members;
        if (arr[index].id) {
            memList.unshift(arr[index]);
        } else {
            memList.unshift({
                id: arr[index].user_id,
                name: arr[index].competitorName,
                displayName: arr[index].competitorName,
                avatarURL: arr[index].competitorImage,
                country: arr[index].competitorContry,
                username: arr[index].competitorUsername,
                countryCode: arr[index].competitorContryCode,
                score: arr[index].score
            })
        }
        setMembers(memList);
        for (let i in arr) {
            if (arr.hasOwnProperty(i)) {
                if (arr[i].insert) {
                    arr[i] = {
                        insert: true,
                        name: <InputPlayers index={parseInt(i, 10) + 1} users={memList} selectMember={selectMember}
                                            selected={selected}/>
                    }
                }
            }
        }
        arr[index] = {
            insert: true,
            name: <InputPlayers index={index + 1} users={memList} selectMember={selectMember}
                                selected={selected}/>
        };

        if (players && players.length) {
            const playerArr = players;
            for (let i in playerArr) {
                if (playerArr.hasOwnProperty(i)) {
                    playerArr[i] = <InputPlayers key={parseInt(players[i].key)} index={parseInt(players[i].key) + 1}
                                                 users={memList} selectMember={selectMember}
                                                 selected={selected}/>;
                }
            }
            setPlayers(playerArr);
        }

        setSelectedMembers([...arr]);
    };

    return (
        <section>
            <table>
                <thead>
                <tr>
                    <th>Seed</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Country</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {selectedMembers.map((member, index) => {
                    return member.insert ? <tr key={index}>
                        <td colSpan="4">{member.name}</td>
                    </tr> : <tr key={index}
                                data-position={index}
                                draggable={true}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                onDragLeave={onDragLeave}
                                className={dragAndDrop && dragAndDrop.draggedTo === Number(index) ? "dropArea" : ""}>
                        <td data-column="First Name">{index + 1}</td>
                        <td data-column="Last Name">
                            <img alt="user" src={member.competitorImage || member.avatarURL}/>
                            {
                                member.competitorName ? member.competitorName.length > 20 ? member.competitorName.substring(0, 18) + '...' : member.competitorName :
                                    member.displayName ? member.displayName.length > 20 ? member.displayName.substring(0, 18) + '...' : member.displayName : ''
                            }
                        </td>
                        <td data-column="Job Title">
                            {
                                member.competitorUsername ? member.competitorUsername.length > 15 ? member.competitorUsername.substring(0, 13) + '...' : member.competitorUsername :
                                    member.username ? member.username.length > 15 ? member.username.substring(0, 13) + '...' : member.username : ''
                            }
                        </td>
                        <td data-column="Twitter">
                            {
                                member.competitorContry ? member.competitorContry.length > 15 ? member.competitorContry.substring(0, 13) + '...' : member.competitorContry :
                                    member.country ? member.country.length > 15 ? member.country.substring(0, 13) + '...' : member.country : ''
                            }

                        </td>
                        <td><span
                            style={{cursor: 'pointer'}} onClick={(e) => onDeletePlayer(e, index)}><i
                            className="fa fa-close"/></span></td>
                    </tr>
                })}
                </tbody>
            </table>
        </section>
    )
};

export default DragToReorderTable;
