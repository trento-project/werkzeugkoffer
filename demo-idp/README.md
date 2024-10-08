# demo-idp Playbook - Provision a Keycloak IDP 🔐

This playbook deploys a `keycloak` identity provider on a `Opensuse Leap 15` machine.

`postgres` is used as database, the setup is a production single keycloak instance deployed a `docker container`,
exposed through `nginx` with a `letsencrypt` certificate automatically provisioned with `certbot` using `http-01` challenge for the domain
provided as playbook variable.


`firewalld` is configured to ensure the appropriate firewall rules to access only the `keycloak` instance.

### Moving parts

- [keycloak](https://www.keycloak.org/)
- [postgresql](https://www.postgresql.org/)
- [openSuse Leap](https://get.opensuse.org/leap)
- [docker](https://www.docker.com/get-started)
- [nginx](https://nginx.org/)

## Installation

### Target machine prerequisites

- openSuse Leap, version >= 15.3
- sshd

### Admin machine prerequisites

- python3.11
- ansible, version 9.7.0
- docker (only when using docker installation method)
- ssh connection to the target machine

### Required Playbook variables

| Name                       | Description                                       |
| -------------------------- | ------------------------------------------------- |
| keycloak_server_name       | Server name of the keycloak instance, domain name |
| keycloak_postgres_password | Password of the postgres keycloak database        |
| keycloak_admin_password    | Default password of the keycloak admin user       |

### Optional Playbook variables

| Name                                    | Description                                                                                                       | Default                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| keycloak_admin_username                 | Default keycloak admin username                                                                                   | trentokcadmin                                                |
| keycloak_container_name                 | Keycloak docker container name                                                                                    | keycloak                                                     |
| keycloak_container_image                | Image and tag of keycloak docker container                                                                        | keycloak_container_image                                     |
| keycloak_postgres_db                    | Keycloak postgres database name, set by postgres_keycloak_db in group_vars/all                                    | keycloak                                                     |
| keycloak_postgres_user                  | Keycloak postgres database username, set by postgres_keycloak_user in group_vars/all                              | keycloak                                                     |
| keycloak_listen_port                    | Keycloak docker container local port binding                                                                      | 8080                                                         |
| provision_postgres                      | Provision postgresql, install, configure database, create users and permissions, set in group_vars/postgres-hosts | true                                                         |
| postgres_install                        | Install rpm postgresql                                                                                            | true                                                         |
| proxy_install_nginx                     | Install nginx rpm                                                                                                 | true                                                         |
| proxy_override_nginx_default_conf       | Override nginx default conf with the custom conf embedding vhosts                                                 | true                                                         |
| proxy_nginx_vhost_filename              | Filename of the keycloak nginx vhost configuration file                                                           | keycloak                                                     |
| proxy_nginx_vhost_http_listen_port      | Http listen port for nginx keycloak vhost                                                                         | 80                                                           |
| proxy_nginx_vhost_https_listen_port     | Https listen port for nginx keycloak vhost                                                                        | 443                                                          |
| proxy_keycloak_upstream_name            | Nginx upstream name for keycloak                                                                                  | keycloak                                                     |
| proxy_ssl_certificate_key_path          | SSL certificate privkey path for keycloak nginx vhost                                                             | /etc/letsencrypt/live/{{ keycloak_server_name }}/privkey.pem |
| proxy_ssl_certificate_path              | SSL certificate path for keycloak nginx vhost                                                                     | "/etc/letsencrypt/live/{{ keycloak_server_name }}/cert.pem"  |
| enable_certbot_certificate_provisioning | Enable SSL cert provisioning for nginx keycloak vhost                                                             | true                                                         |


### Example inventory

```yaml
all:
  children:
    keycloak-server:
      hosts:
        demo-idp:
          ansible_host: "your-host"
          ansible_user: "your-user"
    postgres-hosts:
      hosts:
        demo-idp:
          ansible_host: "your-host"
          ansible_user: "your-user"
```

### Playbook Usage

You could clone this repository or download the latest release of the `demo-idp` playbook through github releases.
Use the playbook `playbook.yml` to install and configure the IDP, use the playbook `playbook.cleanup.yml` to revert the installation.

Prior to running the playbook, tell ansible to fetch the required modules:
```
ansible-galaxy collection install -r requirements.yml
```

> **Note**: <br />
> The `@` character in front of the `vars.json` path is mandatory. This tells `ansible-playbook` that the variables will not be specified in-line but
> as an external file instead.

Run the playbook:
```
ansible-playbook -i path/to/inventory.yml --extra-vars "@path/to/vars.json" playbook.yml
```

Having an inventory file called `inventory.yml` and a vars file called `extra-vars.json`, you could run the playbook

```bash
$ ansible-playbook -i inventory.yml --extra-vars @extra-vars.json playbook.yml
```

**This is just an example you can use all the options of `ansible-playbook` with your inventory and other methods of variables injection.**

### Playbook Usage - Docker container

You can use the docker image `ghcr.io/trento-project/werkzeugkoffer-demo-idp:rolling`, to run both playbooks,
the image contains the playbook files ready to be provisioned and all the necessary dependencies at the right version.

The docker image assumes you mount an `inventory` file and an `extra-vars` file.

Mounting your ssh socket will enable you to access the remote machines like in your local environment.

Assuming you have in the current folder a file called `inventory.yml` and `extra-vars.json`

```bash
docker run \
    -e "SSH_AUTH_SOCK=/ssh-agent" \
    -v $(pwd)/inventory.yml:/playbook/inventory.yml \
    -v $(pwd)/extra-vars.json:/playbook/extra-vars.json \
    -v $SSH_AUTH_SOCK:/ssh-agent \
    ghcr.io/trento-project/werkzeugkoffer-demo-idp:rolling /playbook/inventory.yml /playbook/extra-vars.json
```

#### OSX Docker

```bash
docker run \
    -e "SSH_AUTH_SOCK=/ssh-agent" \
    -v $(pwd)/inventory.yml:/playbook/inventory.yml \
    -v $(pwd)/extra-vars.json:/playbook/extra-vars.json \
    -v /run/host-services/ssh-auth.sock:/ssh-agent \
    ghcr.io/trento-project/werkzeugkoffer-demo-idp:rolling /playbook/inventory.yml /playbook/extra-vars.json
```
