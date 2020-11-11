prod_apk_path := /home/app/facilities-assessment-host/app-servers/external/app.apk

deploy-apk-local:
	cp $(universal_apk_path) ../facilities-assessment-server/external/app.apk

deploy-apk-jss-qa:
	$(call _release_apk,jss.qa,false)
	scp $(apk_path)/app-release.apk sam@139.59.19.108:/tmp/app.apk
	ssh sam@139.59.19.108 "sudo su app -c 'cp /tmp/app.apk /home/app/qa-server/facilities-assessment-host/app-servers/external/.'"

deploy-apk-jss-prod:
	ssh igunatmac "sudo mv $(prod_apk_path) /tmp/app.apk"
	scp $(universal_apk_path) igunatmac:$(prod_apk_path)

deploy-apk-nhsrc-qa:
	scp $(apk_path)/app-release.apk sam@gunak-other:/tmp/app.apk
	ssh sam@gunak-other "sudo su app -c 'cp /tmp/app.apk /home/app/qa-server/facilities-assessment-host/app-servers/external/.'"

install-apk-nhsrc-qa:
	-rm /tmp/nhsrc-qa.apk
	wget -O /tmp/nhsrc-qa.apk https://uat.gunak.nhsrcindia.org/ext/app.apk
	$(call _install_apk,/tmp/nhsrc-qa.apk)

install-apk-nhsrc-prod:
	-rm /tmp/nhsrc-prod.apk
	wget -O /tmp/nhsrc-prod.apk https://gunak.nhsrcindia.org/ext/app.apk
	$(call _install_apk,/tmp/nhsrc-prod.apk)

deploy-apk-nhsrc-prod:
	-ssh gunak-main "sudo mv $(prod_apk_path) /tmp/app.apk"
	scp $(emulator_apk_path) gunak-main:$(prod_apk_path)
