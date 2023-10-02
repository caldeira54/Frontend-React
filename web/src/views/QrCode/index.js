import React, { useState, useEffect } from 'react';
import Qr from 'qrcode.react';
import * as S from './styles';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

function QrCode() {
    return (
        <S.Container>
            <Header />
            <S.Content>
                <h1>CAPTURE O QRCODE PELO APP</h1>

                <S.QrCodeArea>
                    <Qr value="getmacaddress" size={350} />
                </S.QrCodeArea>

                <S.ValidationCode>
                    <span>Digite a numeração que apareceu no seu celular</span>
                    <input type="text" />
                    <button>SINCRONIZAR</button>
                </S.ValidationCode>

                <p>Suas atividades serão sincronizadas com a do celular</p>
            </S.Content>
            <Footer />
        </S.Container>
    );
}

export default QrCode;