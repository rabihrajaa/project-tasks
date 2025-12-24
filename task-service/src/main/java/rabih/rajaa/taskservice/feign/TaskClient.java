package rabih.rajaa.taskservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import rabih.rajaa.taskservice.dto.TaskDTO;

@FeignClient(name = "task-service")
public interface TaskClient {


    @GetMapping("/api/tasks/project/{projectId}")
    Page<TaskDTO> tasksByProject(@PathVariable Long projectId,
                                 @RequestParam int page,
                                 @RequestParam int size);
}