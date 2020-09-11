prod_apk_path := /home/app/facilities-assessment-host/app-servers/external/app.apk

deploy-apk-local:
	cp $(universal_apk_path) ../facilities-assessment-server/external/app.apk

deploy-apk-jss-qa:
	$(call _release_apk,jss.qa,false)
	scp $(apk_path)/app-release.apk sam@139.59.19.108:/tmp/app.apk
	ssh sam@139.59.19.108 "sudo su app -c 'cp /tmp/app.apk home/app/qa-server/facilities-assessment-host/app-servers/ext/.'"

deploy-apk-jss-prod:
	ssh igunatmac "sudo mv $(prod_apk_path) /tmp/app.apk"
	scp $(universal_apk_path) igunatmac:$(prod_apk_path)

deploy-apk-nhsrc-prod:
	-ssh gunak-main "sudo mv $(prod_apk_path) /tmp/app.apk"
	scp $(universal_apk_path) gunak-main:$(prod_apk_path)