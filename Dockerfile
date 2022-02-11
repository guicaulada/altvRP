FROM node:lts-buster

ARG BRANCH=release

# Set default working directory
WORKDIR /opt/altv

# Copy server.cfg
COPY server.cfg server.cfg

# Setup folder structure
RUN mkdir modules
RUN mkdir resources
RUN mkdir data

# Download altv-server binary
RUN wget --no-cache -q -O altv-server https://cdn.altv.mp/server/${BRANCH}/x64_linux/altv-server
RUN chmod +x altv-server 

# Download data files
RUN wget --no-cache -q -O data/vehmodels.bin https://cdn.altv.mp/server/${BRANCH}/x64_linux/data/vehmodels.bin
RUN wget --no-cache -q -O data/vehmods.bin https://cdn.altv.mp/server/${BRANCH}/x64_linux/data/vehmods.bin
RUN wget --no-cache -q -O data/clothes.bin https://cdn.altv.mp/server/${BRANCH}/x64_linux/data/clothes.bin

# Download JS module
RUN mkdir modules/js-module
RUN wget --no-cache -q -O modules/js-module/libnode.so.83 https://cdn.altv.mp/js-module/${BRANCH}/x64_linux/modules/js-module/libnode.so.83
RUN wget --no-cache -q -O modules/js-module/libjs-module.so https://cdn.altv.mp/js-module/${BRANCH}/x64_linux/modules/js-module/libjs-module.so 

# Download CSharp module
RUN wget --no-cache -q -O modules/libcsharp-module.so https://cdn.altv.mp/coreclr-module/${BRANCH}/x64_linux/modules/libcsharp-module.so
RUN wget --no-cache -q -O AltV.Net.Host.dll https://cdn.altv.mp/coreclr-module/${BRANCH}/x64_linux/AltV.Net.Host.dll
RUN wget --no-cache -q -O AltV.Net.Host.runtimeconfig.json https://cdn.altv.mp/coreclr-module/${BRANCH}/x64_linux/AltV.Net.Host.runtimeconfig.json

# Add Microsoft package signing key and repository
RUN wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
RUN dpkg -i packages-microsoft-prod.deb
RUN rm packages-microsoft-prod.deb

# Install .NET SDK 6.0
RUN apt-get update
RUN apt-get install -y apt-transport-https
RUN apt-get install -y dotnet-sdk-6.0

# Copy altvrp resource
WORKDIR /opt/altv/resources/altvrp
COPY dist dist
COPY resource.cfg resource.cfg
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --prod

# Copy altvrp views
WORKDIR /opt/altv/resources/altvrp/views
COPY views/.next .next
COPY views/package.json package.json
COPY views/yarn.lock yarn.lock
RUN yarn install --prod

# Return to default working directory
WORKDIR /opt/altv

# Expose necessary ports
EXPOSE 7788/udp
EXPOSE 7788/tcp
EXPOSE 7789
EXPOSE 7790

# Define startup command
CMD ["/bin/sh", "-c", "./altv-server", "--no-logfile"]