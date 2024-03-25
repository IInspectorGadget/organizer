import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  tagTypes: ["data"],
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: ({ date_start, data_end, title, description }) => ({
        url: 'createtask/',
        method: 'POST',
        body: { date_start, data_end, title, description },
      }),
      invalidatesTags:["data"]
    }),
    updateEvent: builder.mutation({
      query: ({ id, date_start, data_end, title, description }) => ({
        url: `updatetask/${id}/`,
        method: 'PUT',
        body: { date_start, data_end, title, description },
      }),
      invalidatesTags:["data"]
    }),
    getDates: builder.query({
      query: ({ startOfMonth, endOfMonth }) => ({
        url: 'taskslist/',
        method: 'GET',
        params: {
          date_start: startOfMonth,
          data_end: endOfMonth
        },
      }),
      providesTags: ["data"]
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `deletetask/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags:["data"]
    }),
  }),
});

export default api;

export const { useCreateEventMutation, useUpdateEventMutation, useGetDatesQuery, useDeleteEventMutation } = api;