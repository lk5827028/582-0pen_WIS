package org.openwis.metadataportal.services.useralarms;

import java.util.Collections;
import java.util.List;

import jeeves.interfaces.Service;
import jeeves.server.ServiceConfig;
import jeeves.server.context.ServiceContext;

import org.jdom.Element;
import org.openwis.dataservice.ProcessedRequest;
import org.openwis.dataservice.ProcessedRequestService;
import org.openwis.dataservice.useralarms.UserAlarm;
import org.openwis.dataservice.useralarms.UserAlarmManagerWebService;
import org.openwis.dataservice.useralarms.UserAlarmReferenceType;
import org.openwis.metadataportal.common.search.SearchResultWrapper;
import org.openwis.metadataportal.kernel.external.DataServiceProvider;
import org.openwis.metadataportal.services.common.json.JeevesJsonWrapper;
import org.openwis.metadataportal.services.useralarms.dto.RequestUserAlarmDTO;
import org.openwis.metadataportal.services.useralarms.dto.UserAlarmDTO;

import com.google.common.base.Function;
import com.google.common.collect.Lists;

public abstract class AbstractUserAlarmGetService implements Service {

   @Override
   public void init(String appPath, ServiceConfig params) throws Exception {
   }

   @Override
   public Element exec(Element params, ServiceContext ctx) throws Exception {
      String userName = ctx.getUserSession().getUsername();
      List<UserAlarm> userAlarms = Collections.emptyList();

      // Get the alarm service
      UserAlarmManagerWebService userAlarmManager = DataServiceProvider.getUserAlarmManagerService();
      if (userAlarmManager != null) {
         userAlarms = userAlarmManager.getUserAlarmsForUserAndReferenceType(userName, getReferenceType(), 0, 20);
      }

      List<UserAlarmDTO> userAlarmsDto = convertToDtos(userAlarms);

      // Convert it into a search result
      SearchResultWrapper<UserAlarmDTO> searchResults = new SearchResultWrapper<UserAlarmDTO>(userAlarmsDto.size(), userAlarmsDto);

      return JeevesJsonWrapper.send(searchResults);
   }

   /**
    * Returns the reference type this request service is responsible for getting.
    */
   protected abstract UserAlarmReferenceType getReferenceType();

   /**
    * Converts the list of user alarms to a list of UserAlarmDTOs.
    *
    * @param userAlarm
    *       The user alarm
    * @return
    *       The user alarm DTO.
    */
   private List<UserAlarmDTO> convertToDtos(List<UserAlarm> userAlarms) {

      final ProcessedRequestService prs = DataServiceProvider.getProcessedRequestService();

      return Lists.transform(userAlarms, new Function<UserAlarm, UserAlarmDTO>() {
         public UserAlarmDTO apply(UserAlarm userAlarm) {

            // TODO: This is a RMI call, which is expensive.  Replace this with a call which accepts
            // a batch of process request IDs.
            ProcessedRequest processedRequest = prs.getFullProcessedRequest(userAlarm.getReferenceKey());
            return new RequestUserAlarmDTO(userAlarm, processedRequest);
         }

         public boolean equals(Object obj) {
            return (this == obj);
         }
      });
   }

}
