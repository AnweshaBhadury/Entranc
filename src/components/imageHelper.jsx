// src/imageHelper.js
import { builder } from '@sanity/image-url'
import client from '../lib/sanityClient'


export const urlFor = (source) => builder(client).image(source)
