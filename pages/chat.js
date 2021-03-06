import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwMjc0NiwiZXhwIjoxOTU4OTc4NzQ2fQ.YvT8NK6szpma9vYBjkIHeNVTh8bsgQxt8hUOTZfhs5g';
const SUPABASE_URL = 'https://egfhoepldmlnabfiucpa.supabase.co';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient.from('mensagens').select('*').then(({data}) => {
      console.log('Dados da consulta:', data);
      setListaDeMensagens(data);
    });
  }, []);

  /*
  USUÀRIO
  - Usuário digita no campo textarea
  - Aperta enter para enviar
  - Tem que adicionar o texto na listagem

  DEV
  - [X] Campo criado
  - [ ] Vamos usar o onChange, usar o useState (ter if para caso seja enter pra limpar a variável)
  - [ ] Lista de mensagens
  */
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      //id: listaDeMensagens.length + 1,
      de: 'tysonoliveira',
      texto: novaMensagem,
    }

    supabaseClient.from('mensagens').insert([mensagem]).then((oQueEstaVindoComoResposta ) => {
      console.log('Criando mensagem:', oQueEstaVindoComoResposta);
    });

    /*setListaDeMensagens([
      mensagem,
      ...listaDeMensagens
    ]);
    setMensagem('');*/
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        //backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://cdn.eso.org/images/wallpaper4/eso0934a.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          opacity: [0.7],
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList mensagens={listaDeMensagens} />
          {/*Lista de mensagens: {listaDeMensagens.map((mensagemAtual) => {
        
            return (
              <li key={mensagemAtual.id} >
                {mensagemAtual.de}: {mensagemAtual.texto}
              </li>
            )
          })}*/}
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'end',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();

                  handleNovaMensagem(mensagem);

                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '10',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',

                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                //position: 'relative',
                //top: '530px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
          styleSheet={{
            background: '#E05200',
            color: appConfig.theme.colors.neutrals[100]
          }}
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}

    </Box>
  )
}