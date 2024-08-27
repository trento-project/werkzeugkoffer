#!/usr/bin/env bash
set -e

usage() {
    cat <<-EOF
    usage: tento-idp-demo <INVENTORY PATH> <VARS FILE PATH>
    Provision Trento demo identity provider
    Example:
       trento-idp-demo /playbook/inventory.yml /playbook/vars.json
EOF
}

run(){
    if [[ $# -ne 2 ]]; then
        echo "You must provide exactly two arguments" >&2
        usage
        exit 2
    fi

    echo "Starting ansible provisioning..."

    printf "\n inventory path: %s, vars path: %s \n" "$@"

    ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i $1 --extra-vars "@$2" playbook.yml
}

run "$@"
