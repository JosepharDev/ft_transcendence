delimages:
	docker rmi $$(docker images -aq) || true

delcontainers:
	docker rm -f $$(docker ps -aq) || true

delvol:
	docker volume rm $$(docker volume ls -q) || true

delnet:
	docker network rm $$(docker network ls -q) || true


clean: delcontainers delvol delnet 

fclean: delcontainers delvol delnet delimages