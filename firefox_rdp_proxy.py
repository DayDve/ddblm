#!/usr/bin/env python3
import socket
import sys
import select

FIREFOX_DEFAULT_ADDR = ('127.0.0.1', 34375)
PROXY_DEFAULT_ADDR = ('127.0.0.1', 34376)

def read_rdp_message(sock):
    """Считывает одно приветственное сообщение Firefox RDP"""
    len_bytes = b''
    while True:
        char = sock.recv(1)
        if not char:
            return None
        if char == b':':
            break
        len_bytes += char
    try:
        length = int(len_bytes.decode('utf-8'))
    except ValueError:
        return None
    
    data = b''
    while len(data) < length:
        chunk = sock.recv(length - len(data))
        if not chunk:
            return None
        data += chunk
    return len_bytes + b':' + data

def main():
    firefox_port = FIREFOX_DEFAULT_ADDR[1]
    proxy_port = PROXY_DEFAULT_ADDR[1]
    
    if len(sys.argv) > 1:
        try:
            firefox_port = int(sys.argv[1])
        except ValueError:
            print("Использование: firefox_rdp_proxy.py [firefox_port] [proxy_port]")
            sys.exit(1)
            
    if len(sys.argv) > 2:
        try:
            proxy_port = int(sys.argv[2])
        except ValueError:
            print("Использование: firefox_rdp_proxy.py [firefox_port] [proxy_port]")
            sys.exit(1)

    firefox_addr = ('127.0.0.1', firefox_port)
    proxy_addr = ('127.0.0.1', proxy_port)

    print(f"Подключение к Firefox по адресу {firefox_addr[0]}:{firefox_addr[1]}...")
    ff_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        ff_sock.connect(firefox_addr)
    except Exception as e:
        print(f"Ошибка подключения к Firefox: {e}")
        sys.exit(1)
    
    print("Подключено! ПОЖАЛУЙСТА, НАЖМИ [РАЗРЕШИТЬ] (ALLOW) В ДИАЛОГОВОМ ОКНЕ FIREFOX...")
    
    greeting = read_rdp_message(ff_sock)
    if not greeting:
        print("Не удалось получить приветствие от Firefox.")
        ff_sock.close()
        sys.exit(1)
    
    print("Приветствие получено:")
    print(greeting.decode('utf-8', errors='ignore'))
    
    proxy_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    proxy_server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        proxy_server.bind(proxy_addr)
        proxy_server.listen(1)
    except Exception as e:
        print(f"Не удалось привязать прокси-сервер к {proxy_addr}: {e}")
        ff_sock.close()
        sys.exit(1)
        
    print(f"\nПрокси-сервер запущен на {proxy_addr[0]}:{proxy_addr[1]}")
    print("Для остановки нажмите Ctrl+C.\n")

    try:
        while True:
            # Очищаем буфер Firefox перед подключением нового клиента
            ff_sock.setblocking(False)
            try:
                while True:
                    discard = ff_sock.recv(4096)
                    if not discard:
                        break
            except BlockingIOError:
                pass
            ff_sock.setblocking(True)

            client_sock, client_addr = proxy_server.accept()
            print(f"[Клиент подключился: {client_addr}]")
            
            # Отправляем сохраненное приветствие
            try:
                client_sock.sendall(greeting)
            except Exception as e:
                client_sock.close()
                continue
            
            inputs = [client_sock, ff_sock]
            client_active = True
            
            try:
                while client_active:
                    readable, _, exceptional = select.select(inputs, [], inputs, 60)
                    if exceptional:
                        break
                    
                    for s in readable:
                        if s is client_sock:
                            data = client_sock.recv(4096)
                            if not data:
                                client_active = False
                                break
                            ff_sock.sendall(data)
                        elif s is ff_sock:
                            data = ff_sock.recv(4096)
                            if not data:
                                print("[Firefox разорвал соединение]")
                                return
                            client_sock.sendall(data)
            except Exception as e:
                print(f"[Ошибка обмена данными с клиентом: {e}]")
            
            try:
                client_sock.close()
            except Exception:
                pass
            print("[Клиент отключился]")
            
    except KeyboardInterrupt:
        print("\nОстановка прокси-сервера...")
    finally:
        ff_sock.close()
        proxy_server.close()

if __name__ == '__main__':
    main()
