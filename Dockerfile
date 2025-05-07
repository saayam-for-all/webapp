FROM debian:latest

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    firefox-esr \
    wget \
    curl \
    unzip \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# ----------- INSTALAR GECKODRIVER (Firefox) -----------
ARG GECKODRIVER_VERSION=0.34.0
RUN wget -q "https://github.com/mozilla/geckodriver/releases/download/v${GECKODRIVER_VERSION}/geckodriver-v${GECKODRIVER_VERSION}-linux64.tar.gz" \
    && tar -xzf geckodriver-v${GECKODRIVER_VERSION}-linux64.tar.gz \
    && mv geckodriver /usr/local/bin/ \
    && chmod +x /usr/local/bin/geckodriver \
    && rm geckodriver-v${GECKODRIVER_VERSION}-linux64.tar.gz

# Activar Marionette en Firefox
RUN mkdir -p /usr/lib/firefox-esr/distribution \
    && echo '{ "policies": { "Marionette": true } }' > /usr/lib/firefox-esr/distribution/policies.json \
    && echo '#!/bin/bash\nfirefox --marionette' > /usr/local/bin/firefox-marionette \
    && chmod +x /usr/local/bin/firefox-marionette

# ----------- INSTALAR GOOGLE CHROME + CHROMEDRIVER -----------
ARG CHROMEDRIVER_VERSION=122.0.6261.111
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && wget -q "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${CHROMEDRIVER_VERSION}/linux64/chromedriver-linux64.zip" \
    && unzip chromedriver-linux64.zip \
    && mv chromedriver-linux64/chromedriver /usr/local/bin/chromedriver \
    && chmod +x /usr/local/bin/chromedriver \
    && rm -rf chromedriver-linux64*

# ----------- INSTALAR MICROSOFT EDGE + EDGEDRIVER -----------
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg \
    && echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge.list \
    && apt-get update \
    && apt-get install -y microsoft-edge-stable

ARG EDGEDRIVER_VERSION=122.0.2365.92
RUN wget -q "https://msedgedriver.azureedge.net/${EDGEDRIVER_VERSION}/edgedriver_linux64.zip" \
    && unzip edgedriver_linux64.zip \
    && mv msedgedriver /usr/local/bin/edgedriver \
    && chmod +x /usr/local/bin/edgedriver \
    && rm -rf edgedriver_linux64.zip

# ----------- VERIFICACIÓN -----------
RUN firefox --version && geckodriver --version \
    && google-chrome --version && chromedriver --version \
    && microsoft-edge --version && edgedriver --version

    # ----------- INSTALAR ANDROID SDK -----------

ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV ANDROID_HOME=$ANDROID_SDK_ROOT
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Instalar dependencias de Android SDK
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Descargar e instalar el SDK Command Line Tools
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools \
    && wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip \
    && unzip cmdline-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
    && mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest \
    && rm cmdline-tools.zip

# Aceptar licencias e instalar plataformas necesarias
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# ----------- DIRECTORIO DE TRABAJO -----------
WORKDIR /app


CMD ["/bin/bash"]

# vite version should be "^4.0.4"
