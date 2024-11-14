FROM opensuse/tumbleweed AS binary-build
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
RUN zypper -n in make gcc git-core go1.23 nodejs22 npm
COPY . /build
WORKDIR /build
RUN make build

FROM opensuse/leap:15
LABEL org.opencontainers.image.source="https://github.com/trento-project/workzeugkoffer/egeria"
LABEL org.opencontainers.image.authors="Carmine Di Monaco <carmine.dimonaco@suse.com>"
LABEL org.opencontainers.image.title="Egeria"
LABEL org.opencontainers.image.description="Dashboard for trento pr environments"
WORKDIR /app
COPY --from=binary-build /build/egeria .
EXPOSE 4040/tcp
ENTRYPOINT ["/app/egeria"]