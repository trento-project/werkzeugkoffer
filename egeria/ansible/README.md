# egeria Playbook - Deploy Egeria service

This playbook deploys `egeria` the trento pr environments dashboard

Supports Opensuse Leap 15

This playbook is meant to run on trento pr environment machine, the playbook assumes nginx, docker, firewalld and all the playbook dependencies already being installed on the machine.

### Required Playbook variables

| Name                       | Description                                       |
| -------------------------- | ------------------------------------------------- |
| github_app_private_key       | Private Key of the github application used for api authentication |
| github_app_id | Application id of the github application used for api authentication     |
| github_installation_id    | Installation id of the github application used for api authentication        |
| egeria_server_name    | Server name of the egeria service      |

### Example inventory

```yaml
all:
  children:
    egeria-server:
      hosts:
        pr-machine:
          ansible_host: "your-host"
          ansible_user: "your-user"
```

### Playbook Usage

Clone the repository.
Use the playbook `playbook.yml` to install and configure egeria.

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