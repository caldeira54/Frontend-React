import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { format } from 'date-fns';
import * as S from './styles';

import api from '../../services/api';
import isConnected from '../../utils/isConnected';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TypeIcons from '../../utils/tyoeIcons';

import iconCalendar from '../../assets/calendar.png';
import iconClock from '../../assets/clock.png';

function Task({ match }) {
    const [redirect, setRedirect] = useState(false);
    const [type, setType] = useState();
    const [id, setId] = useState();
    const [done, setDone] = useState(false);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [date, setDate] = useState();
    const [hour, setHour] = useState();

    async function loadTaskDetails() {
        await api.get(`/task/${match.params.id}`)
            .then(response => {
                setType(response.data.type);
                setDone(response.data.done);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setDate(format(new Date(response.data.when), 'yyyy-MM-dd'));
                setHour(format(new Date(response.data.when), 'HH:mm'));
            });
    }

    async function save() {
        if (!title)
            return alert('Você precisa informar o título da tarefa!');
        else if (!description)
            return alert('Você precisa informar a descrição da tarefa!');
        else if (!type)
            return alert('Você precisa selecionar o tipo da tarefa!');
        else if (!date)
            return alert('Você precisa informar a data da tarefa!');
        else if (!hour)
            return alert('Você precisa informar o horário da tarefa!');

        if (match.params.id) {
            await api.put(`/task/${match.params.id}`, {
                macaddress: isConnected,
                done,
                type,
                title,
                description,
                when: `${date}T${hour}:00.000`
            });
            setRedirect(true);
        } else {
            await api.post('/task', {
                macaddress: isConnected,
                type,
                title,
                description,
                when: `${date}T${hour}:00.000`
            });
            setRedirect(true);
        }
    }

    async function remove() {
        const res = window.confirm('Deseja realmente excluir a tarefa?');

        if (res == true) {
            await api.delete(`/task/${match.params.id}`)
                .then(() => setRedirect(true));
        }
    }

    useEffect(() => {
        if(!isConnected)
            setRedirect(true);
        
        loadTaskDetails();
    }, []);

    return (
        <S.Container>
            {redirect && <Redirect />}
            <Header />

            <S.Form>
                <S.TypeIcons>
                    {
                        TypeIcons.map((icons, index) => (
                            index > 0 &&
                            <button type="button" onClick={() => setType(index)} >
                                <img src={icons} alt="Tipo da Tarefa"
                                    className={type && type != index && 'inative'} />
                            </button>
                        ))
                    }
                </S.TypeIcons>

                <S.Input>
                    <span>Título</span>
                    <input type="text" placeholder="Título da tarefa..."
                        onChange={e => setTitle(e.target.value)} value={title} />
                </S.Input>

                <S.TextArea>
                    <span>Descrição</span>
                    <textarea rows={5} placeholder="Detalhes da tarefa..."
                        onChange={e => setDescription(e.target.value)} value={description} />
                </S.TextArea>

                <S.Input>
                    <span>Data</span>
                    <input type="date" onChange={e => setDate(e.target.value)} value={date} />
                    <img src={iconCalendar} alt="Calendário" />
                </S.Input>

                <S.Input>
                    <span>Hora</span>
                    <input type="time" onChange={e => setHour(e.target.value)} value={hour} />
                    <img src={iconClock} alt="Relógio" />
                </S.Input>

                <S.Options>
                    <div>
                        <input type="checkbox" checked={done} onChange={() => setDone(!done)} />
                        <span>CONCLUÍDO</span>
                    </div>

                    {match.params.id && <button type="button" onClick={remove}>EXCLUIR</button>}
                </S.Options>

                <S.Save>
                    <button type="button" onClick={save}>SALVAR</button>
                </S.Save>
            </S.Form>

            <Footer />
        </S.Container>
    )
}

export default Task;