const SocketIO = require(`socket.io-client`);
Client = SocketIO(`https://omapi.ru`);

Client.on(`connect`,
    async function() {
        console.log(`Бот смог подключится!`);

        const AuthInfo = {
            token: "token",
            username: "username"
        };

        const Response = await fetch(`https://omapi.ru/api/user/getSocketAccess/?token=${AuthInfo.token}&username=${AuthInfo.username}`);
        const ReponseJSON = await Response.json();
        const AccessToken = ReponseJSON.result;

        Client.emit(`createSocketConnection`, AuthInfo.username, AuthInfo.token, AccessToken,
            function() {
                console.log(`Бот авторизирован`);

                Client.on("onChatMessage",
                    function(username, message, messageID) {

                        if (message == `!online`) {

                            (async () => {
                            let url = `https://api.mcsrvstat.us/2/play.hikarismp.org:25565`;
                                try {
                                    const {players} = await fetch(url).then(response => response.json());
                                    await Client.emit(`createChatMessage`, `Онлайн HikariSMP: ${players.online} / ${players.max}`, console.log);
                                } catch (e) {
                                    console.log(e)
                                    await Client.emit(`createChatMessage`, `Сервер сейчас выключен`, console.log);
                                }
                            })();
                        }
                        if (message == `!disable`) {
                            if(username != "olovink_") {
                                Client.emit(`createChatMessage`, `Вы не можете использовать данную команду`, console.log)
                            } else {
                                Client.emit(`createChatMessage`, `Выключение бота.`, console.log)
                                Client.close()
                            }

                        }
                    }
                );
            }
        );
    }
);
Client.on("disconnect",
    async function() {
        console.log(`Бот отключился`)
    }
);
Client.on("connect_error" ,
    function (error) {
        console.log(error);
        Client.close()
    }
)