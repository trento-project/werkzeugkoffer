#
# spec file for package trento
#
# Copyright (c) 2023 SUSE LLC
#
# All modifications and additions to the file contributed by third parties
# remain the property of their copyright owners, unless otherwise agreed
# upon. The license for this file, and modifications and additions to the
# file, is the same license as for the pristine package itself (unless the
# license for the pristine package is not an Open Source License, in which
# case the license is the MIT License). An "Open Source License" is a
# license that conforms to the Open Source Definition (Version 1.9)
# published by the Open Source Initiative   .

# Please submit bugfixes or comments via https://bugs.opensuse.org/
#


Name:           egeria
# Version will be processed via set_version source service
Version:        0
Release:        0
License:        Apache-2.0
Summary:        Trento PR environments dashboard
URL:            https://github.com/trento-project/werkzeugkoffer/egeria
Source:         %{name}-%{version}.tar.gz
Source1:        vendor.tar.gz
ExclusiveArch:  x86_64
BuildRoot:      %{_tmppath}/%{name}-%{version}-build
BuildRequires:  golang(API) = 1.23 nodejs
Provides:       %{name} = %{version}-%{release}

%description
Egeria is the Trento team pr environments dashboard, runs on the PR env machine

%prep
%setup -q            # unpack project sources
%setup -q -T -D -a 1 # unpack go dependencies in vendor.tar.gz, which was prepared by the source services

%define binaryname egeria

%build
VERSION=%{version} INSTALLATIONSOURCE=Suse make build

%install

# Install the binary.
install -D -m 0755 %{binaryname} "%{buildroot}%{_bindir}/%{binaryname}"

# Install the systemd unit
install -D -m 0644 packaging/systemd/egeria.service %{buildroot}%{_unitdir}/egeria.service

%endif

%pre
%service_add_pre egeria.service

%post
%service_add_post egeria.service

%preun
%service_del_preun egeria.service

%postun
%service_del_postun egeria.service

%files
%defattr(-,root,root)
%license LICENSE
%{_bindir}/%{binaryname}
%{_unitdir}/%{binaryname}.service

%changelog
