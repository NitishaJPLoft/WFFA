import React from 'react';
import {helpers} from "../helper";
import {useSnackbar} from "notistack";

const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
};

const DragToReorderList = (props) => {
    const {tournament, stages, createTreeOfBattles, editPage} = props;
    const [activeIndex, setActiveIndex] = React.useState(0);
    const {enqueueSnackbar} = useSnackbar();
    const [noDrag, setNoDrag] = React.useState(false);

    const [list, setList] = React.useState(stages);
    const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);


    // onDragStart fires when an element
    // starts being dragged
    const onDragStart = (event) => {
        if (event.target.name !== 'tournamentName') {
            setNoDrag(false);
            const initialPosition = Number(event.currentTarget.dataset.position);

            setDragAndDrop({
                ...dragAndDrop,
                draggedFrom: initialPosition,
                isDragging: true,
                originalOrder: list
            });


            // Note: this is only for Firefox.
            // Without it, the DnD won't work.
            // But we are not using it.
            event.dataTransfer.setData("text/html", '');
        } else {
            setNoDrag(true);
        }
    };

    // onDragOver fires when an element being dragged
    // enters a droppable area.
    // In this case, any of the items on the list
    const onDragOver = (event) => {
        if (!noDrag) {
            // in order for the onDrop
            // event to fire, we have
            // to cancel out this one
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
        }

    };

    const onDrop = (event) => {
        event.preventDefault();
        if (!noDrag) {
            setList(dragAndDrop.updatedOrder);

            updateStageOrder();
            setDragAndDrop({
                ...dragAndDrop,
                draggedFrom: null,
                draggedTo: null,
                isDragging: false
            });
        }
    };

    const onDragLeave = () => {
        if (!noDrag) {
            setDragAndDrop({
                ...dragAndDrop,
                draggedTo: null
            });
        }
        // setNoDrag(false);
    };

    const updateStageOrder = async () => {
        const newArr = [];
        for (let [i, obj] of dragAndDrop.updatedOrder.entries()) {
            newArr.push({id: obj.id, name: obj.stageName, orders: i + 1})
        }
        let formData = new FormData();
        formData.append('stages', JSON.stringify(newArr));
        const url = process.env.REACT_APP_API_URI + 'tournament/updatestageorder';
        const data = await helpers.formDataMultipart('POST', url, formData);
        if (data.status === 200) {
            enqueueSnackbar('Stages order updated', {
                variant: 'success',
                autoHideDuration: 3000
            });
        } else {
            enqueueSnackbar('Error in updating Stage order', {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };

    const handleOnClick = index => {
        setActiveIndex(index); // remove the curly braces
    };

    return (
        <section>
            <ul className="nav nav-tabs" role="tablist">
                {!editPage ? <li draggable={false}
                                          onDragStart={onDragStart}
                                          onDragOver={() => {return false}}
                                          onDrop={() => {return false}}
                                          onDragLeave={() => {return false}}
                                 role="presentation" className={activeIndex === 0 ? "active" : "inactive"}><a
                    name="tournamentName"
                    href={'#' + tournament.tournamentName+"t"} aria-controls="home"
                    role="tab"
                    onClick={() => handleOnClick(0)}
                    data-toggle="tab">Name: <b>{tournament.tournamentName}</b></a>
                </li> : ''}
                {list && list.length ? list.map((item, index) => {
                    return (
                        <li
                            key={index}
                            data-position={index}
                            draggable={false}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onDragLeave={onDragLeave}
                            className={(activeIndex === index + 1 ? "active" : "inactive") + (dragAndDrop && dragAndDrop.draggedTo === Number(index) ? " dropArea" : "")}
                        ><a
                            name={'stageName_' + index}
                            href={'#' + (item && item.stageName ? item.stageName : '')+"st"+index} aria-controls="profile" role="tab"
                            onClick={(e) => {
                                !editPage && createTreeOfBattles(e, item.id, item.stageType);
                                handleOnClick(index + 1)
                            }}
                            data-toggle="tab">Stage: {item.stageName}</a>
                            <i className="fas fa-arrows-alt-v"/>
                        </li>
                    )
                }) : null}

            </ul>
        </section>
    )
};

export default DragToReorderList;
