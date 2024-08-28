FROM opensuse/leap:15
LABEL org.opencontainers.image.source="https://github.com/trento-project/werkzeugkoffer"
LABEL org.opencontainers.image.authors="Carmine Di Monaco <carmine.dimonaco@suse.com>"
LABEL org.opencontainers.image.title="trento-demo-idp"
LABEL org.opencontainers.image.description="Ansible playbok for trento demo IDP deploy"
WORKDIR /lib/demo-idp
COPY roles .
COPY requirements.yml .
COPY playbook.yml .
COPY docker/entrypoint.sh .
RUN zypper refresh && \
    zypper install -y ansible openssh-clients && \
    ansible-galaxy install -r requirements.yml
ENTRYPOINT ["/lib/demo-idp/entrypoint.sh"]
