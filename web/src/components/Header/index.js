import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as S from './styles';

import api from '../../services/api';
import isConnected from '../../utils/isConnected';

import logo from '../../assets/logo.png';
import bell from '../../assets/bell.png';

function Header({ clickNotification }) {
  const [lateCount, setLateCount] = useState();

  async function lateVerify() {
    await api.get(`/task/filter/late/11:11:11:11:11:11`)
      .then(response => {
        setLateCount(response.data.length);
      });
  }

  useEffect(() => {
    lateVerify();
  }, []);

  async function logout() {
    await localStorage.removeItem('@todo/macaddress');
    window.location.reload();
  }

  return (
    <S.Container>
      <S.LeftSide>
        <img src={logo} alt="Logo" />
      </S.LeftSide>

      <S.RigthSide>

        <Link to="/">INÍCIO</Link>

        <span className="dividir" />

        <Link to="/task">NOVA TAREFA</Link>

        <span className="dividir" />

        {!isConnected ?
          <Link to="qrcode" href="#">SINCORNIZAR CELULAR</Link>
          :
          <button type="button" onClick={logout}>SAIR</button>
        }

        {
          lateCount &&
          <>
            <span className="dividir" />

            <button onClick={clickNotification} id="notification">
              <img src={bell} alt="Notificação" />
              <span>{lateCount}</span>
            </button>
          </>
        }
      </S.RigthSide>
    </S.Container>
  )
}

export default Header;